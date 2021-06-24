import { makeAutoObservable } from 'mobx';
import { ROOM_STATE } from '../utils/displayStrings';
import EventEmitter from 'events';
import Video, { Room, ConnectOptions, TwilioError, RemoteParticipant } from 'twilio-video';
import { isMobile, removeUndefineds } from '../utils';
import { getResolution } from '../state/settings/renderDimensions';
import { Settings, initialSettings } from '../state/settings/settingsReducer';
import { Callback, IConfig, INotification } from '../types';
import UAParser from 'ua-parser-js';
import { Howl } from 'howler';

class RoomStore {
  rootStore: any;

  room: Room = new EventEmitter() as Room;

  isConnecting: boolean = false;

  settings: Settings = initialSettings;

  notifications: INotification[] = [];

  config: IConfig = {
    loading: false,
    loaded: false,
    endPoint: undefined,
    environmentName: undefined,
    domainName: undefined,
  };

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadConfig();
  }

  setRoom(room: Room) {
    this.room = room;
  }

  setIsConnecting(isConnecting: boolean) {
    this.isConnecting = isConnecting;
  }

  async joinRoom(token: string, option?: ConnectOptions, onError?: Callback) {
    if (this.isConnecting) {
      console.log('Already connecting!');
      return false;
    }
    this.setIsConnecting(true);
    try {
      const newRoom = await Video.connect(token, { ...option, tracks: this.rootStore.participantStore.localTracks });
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

      // All video publications are low by default, except MainParticipant (which is high)
      newRoom.localParticipant.videoTracks.forEach(publication => publication.setPriority('low'));

      if (!this.rootStore.participantStore.participant)
        this.rootStore.participantStore.setParticipant(newRoom.localParticipant);
      newRoom.off(ROOM_STATE.DISCONNECTED, () => {
        this.rootStore.participantStore.disconnectParticipant();
      });
      newRoom.on(ROOM_STATE.DISCONNECTED, () => {
        this.rootStore.participantStore.disconnectParticipant();
      });

      // Assigning all existing participants to be on the participants store
      newRoom.participants?.forEach(participant => {
        this.rootStore.participantStore.addParticipant(participant);
      });

      // Free to use sounds:
      //https://freesound.org/people/FoolBoyMedia/sounds/352656/
      const logInSound = new Howl({
        src: ['assets/sounds/logIn.mp3'],
      });
      //https://freesound.org/people/FoolBoyMedia/sounds/352656/
      const logOutSound = new Howl({
        src: ['assets/sounds/logOut.mp3'],
      });

      const parser = new UAParser();
      const result = parser.getResult();

      const participantConnected = (participant: RemoteParticipant) => {
        if (result.os.name !== 'iOS') logInSound.play();
        this.rootStore.participantStore.addParticipant(participant);
      };
      const handleDominantSpeakerChanged = (newDominantSpeaker: RemoteParticipant) => {
        if (newDominantSpeaker !== null) {
          this.rootStore.participantStore.setDominantSpeaker(newDominantSpeaker);
        }
      };

      // Since 'null' values are ignored, we will need to listen for the 'participantDisconnected'
      // event, so we can set the dominantSpeaker to 'null' when they disconnect.
      const handleParticipantDisconnected = (participant: RemoteParticipant) => {
        if (this.rootStore.participantStore.dominantSpeaker === participant) {
          return this.rootStore.participantStore.setDominantSpeaker(null);
        }
        if (result.os.name !== 'iOS') logOutSound.play();
        this.rootStore.participantStore.removeParticipantSid(participant.sid);
        // updateScreenShareParticipant();
      };

      this.setRoom(newRoom);

      this.room.on('participantConnected', participantConnected);
      this.room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
      this.room.on('participantDisconnected', handleParticipantDisconnected);
      return () => {
        this.room.off('participantConnected', participantConnected);
        this.room.off('dominantSpeakerChanged', handleDominantSpeakerChanged);
        this.room.off('participantDisconnected', handleParticipantDisconnected);
      };
    } catch (err) {
      console.log(err.message);
      onError && onError(err);
      this.setIsConnecting(false);
    }
    return true;
  }

  setNotification(notification: INotification) {
    this.notifications = [...this.notifications, { ...notification, type: 'notification' }];
  }

  setError(error: TwilioError) {
    this.notifications = [...this.notifications, { ...error, type: 'error' }];
  }

  dismissNotfication(notification: INotification) {
    this.notifications = this.notifications.slice(1);
  }

  setSetting(key: keyof Settings, value: string) {
    this.settings = { ...this.settings, [key]: value };
  }

  setSettings(settings: Settings) {
    this.settings = settings;
  }

  get roomState() {
    return this.room?.state || ROOM_STATE.DISCONNECTED;
  }

  get options() {
    const connectionOptions: ConnectOptions = {
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
      maxAudioBitrate: Number(this.settings.maxAudioBitrate),
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
    };

    if (isMobile && connectionOptions?.bandwidthProfile?.video) {
      connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
    }

    // Here we remove any 'undefined' values. The twilio-video SDK will only use defaults
    // when no value is passed for an option. It will throw an error when 'undefined' is passed.
    return removeUndefineds(connectionOptions);
  }

  setConfig(config: IConfig) {
    this.config = config;
  }

  async loadConfig() {
    const public_url = process.env.PUBLIC_URL;
    try {
      const request = await fetch(`${public_url}/config.json`);
      const response = await request.json();
      this.setConfig({ ...response, loaded: true, loading: false });
    } catch (err) {
      this.setConfig({ ...this.config, loading: false, loaded: false });
      this.setError({ message: `Could not fetch data from ${public_url}/config.json` } as TwilioError);
    }
  }
}

export default RoomStore;
