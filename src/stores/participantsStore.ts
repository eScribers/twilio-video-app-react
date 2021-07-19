import { CreateLocalTrackOptions, LocalAudioTrack, LocalVideoTrack, LocalParticipant, Participant } from 'twilio-video';
import { makeAutoObservable } from 'mobx';
import sortParticipants from '../utils/sortParticipants';
import roleChecker from '../utils/rbac/roleChecker';
import Video, { LocalDataTrack, TwilioError } from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '../constants';
import { ParticipantIdentity } from '../utils/participantIdentity';
import { ROLE_PERMISSIONS } from '../utils/rbac/rolePermissions';
import axios from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { ParticipantInformation } from '../types/participantInformation';
import moment, { Moment } from 'moment';
import { NOTIFICATION_MESSAGE, ROOM_STATE, TRACK_TYPE } from '../utils/displayStrings';
import { PARTICIPANT_TYPES } from '../utils/rbac/ParticipantTypes';
import { TrackPublication } from 'twilio-video';
import localParticipantStore from './localParticipantStore';

const query = new URLSearchParams(window.location.search);

class participantsStore {
  rootStore: any;

  userToken?: string;

  isFetchingUserToken: boolean = false;

  localParticipant?: localParticipantStore;

  joinTime?: Moment;

  publishingVideoTrackInProgress: boolean = false;

  localDataTrack?: LocalDataTrack;

  localAudioTrack?: LocalAudioTrack;

  localVideoTrack?: LocalVideoTrack;

  participants: Participant[] = [];

  sortedParticipants: Participant[] = [];

  selectedParticipant: null | string = null;

  deviceList: MediaDeviceInfo[] = [];

  dominantSpeaker: string | null = null;

  participantInformation: ParticipantInformation | null = null;

  screenSharingInProgress: boolean = false;

  hasTriedAuthorisation: boolean = false;

  wasSilenced: boolean = false;

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    this.localParticipant = new localParticipantStore(rootStore, this);
    makeAutoObservable(this);
    (async () => {
      await this.getDevices();
      this.toggleVideoEnabled();
      this.toggleAudioEnabled();
      this.addDataTrack();
    })();

    navigator.mediaDevices?.addEventListener('devicechange', () => {
      this.getDevices();
    });
  }

  setDevices(devices: MediaDeviceInfo[]) {
    this.deviceList = devices || [];
  }

  async getDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (err) {
      console.error('Failed to get devices!', err.message);
      console.trace();
      this.rootStore.roomsStore.setError(err);
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.setDevices(devices);
  }

  setParticipants(participants: Participant[]) {
    this.participants = participants;
    this.sortedParticipants = sortParticipants(participants);
  }

  addParticipant(participant: Participant) {
    this.setParticipants([...this.participants, participant]);
    if (this.dominantSpeaker === null) {
      this.setDominantSpeaker(participant.identity);
    }
  }

  removeParticipantSid(participantSid: number) {
    this.setParticipants([...this.participants.filter(p => p.sid !== participantSid)]);
  }

  setSelectedParticipant(participant: string | undefined) {
    if (!participant) return;
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
      if (!newTrack) throw new Error('Failed to create local audio track');
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
    let newTrack;
    newTrack = await Video.createLocalVideoTrack(options);
    // if(newTrack)
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
  async toggleVideoEnabled() {
    if (this.publishingVideoTrackInProgress) return;
    this.setPublishingVideoTrackInProgress(true);
    if (this.localVideoTrack) {
      const localTrackPublication = this.localParticipant?.participant?.unpublishTrack(this.localVideoTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      this.localParticipant?.participant?.emit('trackUnpublished', localTrackPublication);
      this.localVideoTrack.stop();
      this.setVideoTrack(undefined);
      this.setPublishingVideoTrackInProgress(false);
    } else {
      let track: LocalVideoTrack;
      try {
        track = await this.getLocalVideoTrack();
      } catch (err) {
        this.rootStore.roomsStore.setError(err.message);
        return Promise.reject(err);
      }
      try {
        this.localParticipant?.participant?.publishTrack(track, { priority: 'low' });
      } catch (err) {
        throw new Error(`Could not publish video track: ${err}`);
      }
      // This timeout is here to prevent unpublishing a track that hasn't been published yet (causing a crash)
      // Test it by commenting the setTimeout and spamming the video on/off button - Gal 16.06.2021
      setTimeout(() => {
        this.setPublishingVideoTrackInProgress(false);
      }, 200);
      return track;
    }
    return false;
  }

  async toggleAudioEnabled() {
    if (this.localAudioTrack) {
      if (this.localAudioTrack.isEnabled) {
        this.setLocalAudioTrackEnabled(false);
      } else {
        this.setLocalAudioTrackEnabled(true);
      }
    } else {
      return this.getLocalAudioTrack();
      // setNotification({ message: NOTIFICATION_MESSAGE.CANNOT_RECORD_AUDIO });
    }
    return;
  }

  addDataTrack() {
    // let localDataTrackOptions = {} as LocalDataTrackOptions;
    // localDataTrackOptions.maxRetransmits = 3;
    // localDataTrackOptions.ordered = true;
    // this.localDataTrack = new LocalDataTrack(localDataTrackOptions);
  }

  setDominantSpeaker(participant: string | null) {
    this.dominantSpeaker = participant;
    if (participant === null) return;

    // Reordering the participants to put the dominantSpeaker on top
    const reorderParticipants = [...this.participants].filter(p => p.identity !== participant);
    const foundParticipant = this.participants.find(p => p.identity === participant);
    if (foundParticipant) {
      this.setParticipants([foundParticipant, ...reorderParticipants]);
    }
  }

  get mainParticipant() {
    return (
      this.selectedParticipant ||
      this.screenShareParticipant()?.identity ||
      this.dominantSpeaker ||
      this.participants[0].identity ||
      this.localParticipant?.participant?.identity
    );
  }

  get muteableParticipants() {
    let muteableParticipants: Participant[] = this.participants.filter(participant => {
      let remoteParticipantrole = ParticipantIdentity.Parse(participant.identity).role;
      if (!this.localParticipant?.participantType) return false;
      if (this.localParticipant?.participantType === remoteParticipantrole) return false;
      if (
        roleChecker.doesRoleHavePermission(
          ROLE_PERMISSIONS.MUTE_PARTICIPANT,
          this.localParticipant?.participantType,
          remoteParticipantrole
        )
      )
        return true;
      return false;
    });
    return muteableParticipants;
  }

  get isSipClientConnected() {
    return (
      this.participants.filter(
        participant => ParticipantIdentity.Parse(participant.identity)['role'] === PARTICIPANT_TYPES.REPORTER_RECORDING
      ).length >= 1
    );
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

  setHasTriedAuthorisation(state: boolean) {
    this.hasTriedAuthorisation = state;
  }

  setParticipantInformation(data: ParticipantInformation) {
    this.participantInformation = data;
  }

  async authoriseParticipant() {
    if (!this.rootStore.roomsStore.config.loaded)
      return console.log("Tried authorizing participant but config hasn't loaded yet");
    if (this.hasTriedAuthorisation) return console.log('Tried to authorize participant but it was already authorized');

    const participantAuthToken = window.location.hash.substr(1);
    const url = `${this.rootStore.roomsStore.config.endPoint}/authorise-participant`;
    console.log('attempting authorise ' + new Date().toLocaleTimeString());
    this.setHasTriedAuthorisation(true);

    try {
      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
      });

      if (!data.participantInfo) throw new Error('No participantInfo was received from the server');
      this.setParticipantInformation(data.participantInfo);
      return data.participantInfo;
    } catch (err) {
      console.log('Authorization failed: ', err.message);
      this.rootStore.roomsStore.setError({ message: 'Could not authorize participant; ' + err } as TwilioError);
    }

    return false;
  }

  setJoinTime(time: Moment) {
    this.joinTime = time;
  }

  setUserToken(token: string) {
    this.userToken = token;
  }

  setIsFetchingToken(state: boolean) {
    this.isFetchingUserToken = state;
  }

  async getToken(participantInformation: ParticipantInformation) {
    if (!this.rootStore.roomsStore.config.loaded) return null;
    try {
      this.setIsFetchingToken(true);
      const participantAuthToken = window.location.hash.substr(1);
      const url = `${this.rootStore.roomsStore.config.endPoint}/token`;
      const { data: res } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data: {
          caseReference: participantInformation.caseReference,
          partyName: participantInformation.displayName,
          role: participantInformation.role,
          userId: participantInformation.userId,
          videoConferenceRoomName: participantInformation.videoConferenceRoomName,
        },
      });

      this.setJoinTime(moment());

      this.setIsFetchingToken(false);

      if (
        !res.roomExist &&
        !roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, participantInformation.role)
      )
        return NOTIFICATION_MESSAGE.ROOM_NOT_FOUND;

      this.setUserToken(res.result);
      const user = jwtDecode<JwtPayload>(res.result);

      return user.twilioToken;
    } catch (err) {
      console.log('error occured on getToken: ' + JSON.stringify(err));
      return '';
    }
  }

  async disconnectParticipant() {
    const config = this.rootStore.roomsStore.config;
    if (!config.loaded || !this.localParticipant?.participant) return null;
    const returnUrl = query.get('returnUrl');

    let isRegistered: boolean =
      this.localParticipant?.participant.identity?.length > 0 &&
      ParticipantIdentity.Parse(this.localParticipant?.participant.identity).isRegisteredUser;

    if (this.joinTime && moment().isSameOrAfter(this.joinTime.add(3, 'hours').add(50, 'minutes'))) {
      return window.location.reload();
    }

    const decodedRedirectTabulaUrl = atob(returnUrl ? returnUrl : '');
    const loginPageUrl = `http://tabula-${config.environmentName}.${config.domainName}/tabula/welcome/thankyou`;

    if (isRegistered) window.location.replace(decodedRedirectTabulaUrl);
    else window.location.replace(loginPageUrl);
  }

  setScreenSharingInProgress(state: boolean) {
    if (this.screenSharingInProgress !== state) this.screenSharingInProgress = state;
  }

  screenShareParticipant() {
    const isSomebodySharingScreen = [...this.participants, this.localParticipant?.participant].find(
      (participant: Participant | LocalParticipant | undefined) =>
        participant &&
        Array.from<TrackPublication>(participant.tracks.values()).find(track => {
          if (track.trackName.includes(TRACK_TYPE.SCREEN)) {
            return true;
          }
          return false;
        })
    );
    if (isSomebodySharingScreen) {
      setTimeout(() => {
        this.setScreenSharingInProgress(true);
      }, 0);
    } else {
      setTimeout(() => {
        this.setScreenSharingInProgress(false);
      }, 0);
    }
    return isSomebodySharingScreen;
  }

  get isHostIn() {
    if (this.rootStore.roomsStore.currentRoom?.state !== ROOM_STATE.CONNECTED) return true;
    let result = false;
    [...this.participants, this.localParticipant?.participant].forEach(participant => {
      if (
        (participant && ParticipantIdentity.Parse(participant.identity).role === PARTICIPANT_TYPES.REPORTER) ||
        (participant && ParticipantIdentity.Parse(participant.identity).role === PARTICIPANT_TYPES.HEARING_OFFICER)
      ) {
        result = true;
      }
      return;
    });

    return result;
  }

  get isReporterIn() {
    if (this.rootStore.roomsStore.currentRoom?.state !== ROOM_STATE.CONNECTED) return true;
    let result = false;
    [...this.participants, this.localParticipant?.participant].forEach(participant => {
      if (participant && ParticipantIdentity.Parse(participant.identity).role === PARTICIPANT_TYPES.REPORTER) {
        result = true;
      }
    });
    return result;
  }

  get isSilenced() {
    let result = false;
    if (
      !this.localParticipant?.participant?.identity ||
      ParticipantIdentity.Parse(this.localParticipant?.participant?.identity || '').role !== PARTICIPANT_TYPES.REPORTER
    ) {
      this.wasSilenced = result;
      return result;
    }

    if (!this.wasSilenced && this.isSipClientConnected) {
      this.rootStore.roomsStore.setNotification({
        message:
          'Dear reporter, a Zoiper call has been connected. You are automatically muted and all incoming audio from this tab is silenced in order to prevent the audio from being played twice. Please mute/unmute yourself directly from Zoiper',
      });
      console.log('You are silenced because of a zoiper call');
      result = true;
      if (this.localAudioTrack) this.setLocalAudioTrackEnabled(false);
    }
    if (this.wasSilenced && !this.isSipClientConnected) {
      this.rootStore.roomsStore.setNotification({ message: 'Zoiper call disconnected. Please unmute yourself' });
      console.log('Zoiper call disconnected, you are un-silenced');
      result = false;
    }
    this.wasSilenced = result;
    return result;
  }
}

export default participantsStore;
