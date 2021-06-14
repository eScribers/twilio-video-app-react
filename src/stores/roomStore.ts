import { makeAutoObservable } from 'mobx';
import { ROOM_STATE } from '../utils/displayStrings';
import EventEmitter from 'events';
import { Room } from 'twilio-video';
import { ConnectOptions } from 'twilio-video';
import { isMobile, removeUndefineds } from '../utils';
import { getResolution } from '../state/settings/renderDimensions';
import { Settings, initialSettings } from '../state/settings/settingsReducer';
import Video from 'twilio-video';
import { Callback } from '../types';

class RoomStore {
  rootStore: any;

  room: Room = new EventEmitter() as Room;

  isConnecting: boolean = false;

  settings: Settings = initialSettings;

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setRoom(room: Room) {
    this.room = room;
  }

  setIsConnecting(isConnecting: boolean) {
    this.isConnecting = isConnecting;
  }
  async joinRoom(token: string, option?: ConnectOptions, onError?: Callback) {
    if (this.isConnecting) return console.log('Already connecting!');
    this.setIsConnecting(true);
    try {
      console.log('Joining room', this.rootStore.participantStore.localTracks);
      const newRoom = await Video.connect(token, { ...option, tracks: this.rootStore.participantStore.localTracks });
      this.setRoom(newRoom);
      this.setIsConnecting(false);
      const disconnect = () => newRoom.disconnect();

      newRoom.once(ROOM_STATE.DISCONNECTED, () => {
        setTimeout(() => this.setRoom(new EventEmitter() as Room)); // Reset the room only after all other `disconnected` listeners have been called.
        window.removeEventListener('beforeunload', disconnect);
        if (isMobile) window.removeEventListener('pagehide', disconnect);
      });

      window.addEventListener('beforeunload', disconnect); // disconnect from the room when the user closes the browser
      if (isMobile) window.addEventListener('pagehide', disconnect);

      // @ts-ignore
      window.twilioRoom = newRoom; // Registering the room globally

      console.log(newRoom.localParticipant.videoTracks);

      // All video publications are low by default, except MainParticipant (which is high)
      newRoom.localParticipant.videoTracks.forEach(publication => publication.setPriority('low'));

      this.rootStore.participantStore.setParticipant(newRoom.localParticipant);
    } catch (err) {
      console.log(err.message);
      onError && onError(err);
      this.setIsConnecting(false);
    }
  }

  setSetting(key: keyof Settings, value: string) {
    this.settings = { ...this.settings, [key]: value };
  }

  get roomState() {
    return this.room?.state || ROOM_STATE.DISCONNECTED;
  }

  get options() {
    const connectionOptions: ConnectOptions = {
      // Bandwidth Profile, Dominant Speaker, and Network Quality
      // features are only availabl§e in Small Group or Group Rooms.
      // Please set "Room Type" to "Group" or "Small Group" in your
      // Twilio Console: https://www.twilio.com/console/video/configure
      bandwidthProfile: {
        video: {
          mode: this.settings.bandwidthProfileMode,
          dominantSpeakerPriority: this.settings.dominantSpeakerPriority,
          renderDimensions: {
            low: getResolution(this.settings.renderDimensionLow),
            standard: getResolution(this.settings.renderDimensionStandard),
            high: getResolution(this.settings.renderDimensionHigh),
          },
          maxTracks: Number(this.settings.maxTracks),
        },
      },
      dominantSpeaker: true,
      networkQuality: { local: 1, remote: 1 },

      // Comment this line if you are playing music.
      maxAudioBitrate: Number(this.settings.maxAudioBitrate),

      // VP8 simulcast enables the media server in a Small Group or Group Room
      // to adapt your encoded video quality for each RemoteParticipant based on
      // their individual bandwidth constraints. Simulcast should be disabled if
      // you are using Peer-to-Peer or 'Go' Rooms.
      // preferredVideoCodecs: [{ codec: 'VP8', simulcast: roomType !== 'peer-to-peer' && roomType !== 'go' }],
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: this.rootStore.participantStore.participants.length > 2 }],
    };
    if (isMobile && connectionOptions?.bandwidthProfile?.video) {
      connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
    }

    // Here we remove any 'undefined' values. The twilio-video SDK will only use defaults
    // when no value is passed for an option. It will throw an error when 'undefined' is passed.
    return removeUndefineds(connectionOptions);
  }
}

export default RoomStore;
