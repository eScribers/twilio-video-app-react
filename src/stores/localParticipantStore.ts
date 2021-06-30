import { LocalParticipant } from 'twilio-video';
import { ParticipantIdentity } from '../utils/participantIdentity';

class localParticipantStore {
  rootStore: any;

  participantsStore: any;

  participant?: LocalParticipant;

  constructor(rootStore: any, participantsStore: any) {
    // super();

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
    const participantType: string = ParticipantIdentity.Parse(this.participant?.identity || '').partyType;
    return participantType;
  }
}

export default localParticipantStore;
