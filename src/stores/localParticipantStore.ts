import { LocalParticipant, MediaStreamTrackPublishOptions } from 'twilio-video';
import { ParticipantIdentity } from '../utils/participantIdentity';

class localParticipantStore {
  rootStore: any;

  participantsStore: any;

  participant?: LocalParticipant;

  isSharingScreen: boolean = false;

  stopScreenShare: () => void = () => {};

  constructor(rootStore: any, participantsStore: any) {
    this.rootStore = rootStore;
    this.participantsStore = participantsStore;
  }
  setParticipant(participant?: LocalParticipant) {
    this.participant = participant;
    if (this.participantsStore.dominantSpeaker === null && participant) {
      this.participantsStore.setDominantSpeaker(participant.identity);
    }
  }

  get participantType() {
    if (!this.participant?.identity) return '';
    const participantType: string = ParticipantIdentity.Parse(this.participant?.identity || '').role;
    return participantType;
  }

  async toggleScreenShare() {
    try {
      if (this.isSharingScreen) {
        return this.stopScreenShare();
      }

      if (!this.participant) throw new Error('Not connected');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
          frameRate: 10,
          height: 1080,
          width: 1920,
        },
      });
      const track = stream.getTracks()[0];

      // All video tracks are published with 'low' priority. This works because the video
      // track that is displayed in the 'MainParticipant' component will have it's priority
      // set to 'high' via track.setPriority()
      const trackPublication = await this.rootStore.roomsStore.currentRoom.localParticipant.publishTrack(track, {
        name: 'screen',
        priority: 'low',
      } as MediaStreamTrackPublishOptions);
      this.stopScreenShare = () => {
        this.participant?.unpublishTrack(track);
        // TODO: remove this if the SDK is updated to emit this event
        this.participant?.emit('trackUnpublished', trackPublication);
        track.stop();
        this.setIsSharingScreen(false);
      };

      track.onended = this.stopScreenShare;
      this.setIsSharingScreen(true);
    } catch (error) {
      // Don't display an error if the user closes the screen share dialog
      if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
        this.rootStore.roomsStore.setError({ message: error.message });
      }
    }
  }

  setStopScreenShare(reference: () => void) {
    this.stopScreenShare = reference;
  }

  setIsSharingScreen(value: boolean) {
    this.isSharingScreen = value;
  }
}

export default localParticipantStore;
