import { CreateLocalTrackOptions, LocalAudioTrack, LocalVideoTrack, LocalParticipant, Participant } from 'twilio-video';
import { makeAutoObservable } from 'mobx';
import sortParticipants from '../utils/sortParticipants';
import roleChecker from '../utils/rbac/roleChecker';
import Video, { LocalDataTrackOptions, LocalDataTrack } from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '../constants';
import { ParticipantIdentity } from '../utils/participantIdentity';
import { ROLE_PERMISSIONS } from '../utils/rbac/rolePermissions';

class ParticipantStore {
  rootStore: any;

  participant?: LocalParticipant;

  publishingVideoTrackInProgress: boolean = false;

  localDataTrack?: LocalDataTrack;

  localAudioTrack?: LocalAudioTrack;

  localVideoTrack?: LocalVideoTrack;

  participants: Participant[] = [];

  sortedParticipants: Participant[] = [];

  selectedParticipant: null | Participant = null;

  deviceList: MediaDeviceInfo[] = [];

  dominantSpeaker: Participant | null = null;

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    (async () => {
      await this.getDevices();
      this.toggleVideoEnabled();
      this.toggleAudioEnabled();
      this.addDataTrack();
    })();

    navigator.mediaDevices.addEventListener('devicechange', this.getDevices);
  }

  setDevices(devices: MediaDeviceInfo[]) {
    this.deviceList = devices;
  }

  async getDevices() {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('Got devices', devices);
    this.setDevices(devices);
  }

  setParticipants(participants: Participant[]) {
    this.participants = participants;
    this.sortedParticipants = sortParticipants(participants);
  }

  setParticipant(participant: LocalParticipant) {
    this.participant = participant;
  }

  addParticipant(participant: Participant) {
    this.setParticipants([...this.participants, participant]);
  }

  removeParticipantSid(participantSid: string) {
    this.setParticipants([...this.participants.filter(p => p.sid !== participantSid)]);
  }

  setSelectedParticipant(participant: null | Participant) {
    if (this.selectedParticipant === participant) {
      this.selectedParticipant = null;
      return;
    }
    this.selectedParticipant = participant;
  }

  setLocalAudioTrackEnabled(state: boolean) {
    if (!this.localAudioTrack) return;
    if (state === true) {
      return this.localAudioTrack.enable();
    } else if (state === false) {
      return this.localAudioTrack.disable();
    }
  }

  async getLocalAudioTrack(deviceId?: string, groupId?: string) {
    let options: CreateLocalTrackOptions = !deviceId
      ? {}
      : {
          deviceId: { exact: deviceId },
          groupId: { exact: groupId },
        };
    try {
      const newTrack = await Video.createLocalAudioTrack(options);
      this.setAudioTrack(newTrack);

      return newTrack;
    } catch (e) {
      console.log(`Failed to create local audio track: ${e.message}`);
    }
  }

  async getLocalVideoTrack() {
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

    const hasSelectedVideoDevice = this.devices.videoInputDevices.some(
      device => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    const options: CreateLocalTrackOptions = {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
      ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
    };

    const newTrack = await Video.createLocalVideoTrack(options);
    this.setVideoTrack(newTrack);
    return newTrack;
  }

  get localTracks() {
    return [this.localAudioTrack, this.localVideoTrack, this.localDataTrack].filter(x => !!x);
  }

  get devices() {
    return {
      audioInputDevices: this.deviceList.filter(device => device.kind === 'audioinput'),
      videoInputDevices: this.deviceList.filter(device => device.kind === 'videoinput'),
      audioOutputDevices: this.deviceList.filter(device => device.kind === 'audiooutput'),
      hasAudioInputDevices: this.deviceList.filter(device => device.kind === 'audioinput').length > 0,
      hasVideoInputDevices: this.deviceList.filter(device => device.kind === 'videoinput').length > 0,
    };
  }

  setVideoTrack(videoTrack: LocalVideoTrack | undefined) {
    this.localVideoTrack = videoTrack;
  }
  setAudioTrack(audioTrack: LocalAudioTrack | undefined) {
    this.localAudioTrack = audioTrack;
  }

  setPublishingVideoTrackInProgress(state: boolean) {
    this.publishingVideoTrackInProgress = state;
  }
  toggleVideoEnabled() {
    if (this.publishingVideoTrackInProgress) return;
    this.setPublishingVideoTrackInProgress(true);
    if (this.localVideoTrack) {
      const localTrackPublication = this.participant?.unpublishTrack(this.localVideoTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      this.participant?.emit('trackUnpublished', localTrackPublication);
      this.localVideoTrack.stop();
      this.setVideoTrack(undefined);
      this.setPublishingVideoTrackInProgress(false);
    } else {
      this.getLocalVideoTrack().then((track: LocalVideoTrack) => {
        this.participant?.publishTrack(track, { priority: 'low' });
        // This timeout is here to prevent unpublishing a track that hasn't been published yet (causing a crash)
        // Test it by commenting the setTimeout and spamming the video on/off button - Gal 16.06.2021
        setTimeout(() => {
          this.setPublishingVideoTrackInProgress(false);
        }, 200);
      });
    }
  }

  toggleAudioEnabled() {
    if (this.localAudioTrack) {
      if (this.localAudioTrack.isEnabled) {
        this.setLocalAudioTrackEnabled(false);
      } else {
        this.setLocalAudioTrackEnabled(true);
      }
    } else {
      this.getLocalAudioTrack();
      // setNotification({ message: NOTIFICATION_MESSAGE.CANNOT_RECORD_AUDIO });
    }
  }

  addDataTrack() {
    let localDataTrackOptions = {} as LocalDataTrackOptions;
    localDataTrackOptions.maxRetransmits = 3;
    localDataTrackOptions.ordered = true;
    this.localDataTrack = new LocalDataTrack(localDataTrackOptions);
  }

  setDominantSpeaker(participant: Participant) {
    this.dominantSpeaker = participant;
  }

  get mainParticipant() {
    const remoteScreenShareParticipant = false;
    return (
      this.selectedParticipant ||
      remoteScreenShareParticipant ||
      this.dominantSpeaker ||
      this.participants[0] ||
      this.participant
    );
  }

  get localParticipantType() {
    if (!this.participant?.identity) return '';
    const localParticipantType: string = ParticipantIdentity.Parse(this.participant?.identity || '').partyType;
    return localParticipantType;
  }

  get muteableParticipants() {
    let muteableParticipants: Participant[] = this.participants.filter(participant => {
      let remoteParticipantPartyType = ParticipantIdentity.Parse(participant.identity).partyType;
      if (this.localParticipantType === remoteParticipantPartyType) return false;
      if (
        roleChecker.doesRoleHavePermission(
          ROLE_PERMISSIONS.MUTE_PARTICIPANT,
          this.localParticipantType,
          remoteParticipantPartyType
        )
      )
        return true;
      return false;
    });
    return muteableParticipants;
  }

  muteAllNoneModerators() {
    return this.muteableParticipants.map(participant => {
      return this.muteOtherParticipant(participant);
    });
  }

  muteOtherParticipant(participant: Participant) {
    console.log(
      'TODO: Check your permission and send Twilio Sync to mute the selected participant',
      participant.identity,
      participant
    );
  }

  removeOtherParticipant(participant: Participant) {
    console.log(
      'TODO: Check your permission and send Twilio Sync to kick the selected participant',
      participant.identity,
      participant
    );
  }
}

export default ParticipantStore;
