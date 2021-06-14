import { CreateLocalTrackOptions, LocalAudioTrack, LocalVideoTrack, LocalParticipant, Participant } from 'twilio-video';
import { makeAutoObservable } from 'mobx';
import sortParticipants from '../utils/sortParticipants';
import Video from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '../constants';

class ParticipantStore {
  rootStore: any;

  participant?: LocalParticipant;

  localAudioTrack?: LocalAudioTrack;

  localVideoTrack?: LocalVideoTrack;

  participants: Participant[] = [];

  sortedParticipants: Participant[] = [];

  selectedParticipant: null | Participant = null;

  deviceList: MediaDeviceInfo[] = [];

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    this.getDevices();
    navigator.mediaDevices.addEventListener('devicechange', this.getDevices);
  }

  setDevices(devices: MediaDeviceInfo[]) {
    this.deviceList = devices;
  }

  async getDevices() {
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

  async getLocalAudioTrack(deviceId?: string, groupId?: string) {
    if (!this?.participant) return null;
    let options: CreateLocalTrackOptions = !deviceId
      ? {}
      : {
          deviceId: { exact: deviceId },
          groupId: { exact: groupId },
        };
    const newTrack = await Video.createLocalAudioTrack(options);
    this.localAudioTrack = newTrack;
    return newTrack;
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
    this.localVideoTrack = newTrack;
    return newTrack;
  }

  get localTracks() {
    return [this.localAudioTrack, this.localVideoTrack];
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
}

export default ParticipantStore;
