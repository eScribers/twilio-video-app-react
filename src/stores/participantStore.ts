import { Participant } from 'twilio-video';
import { makeAutoObservable } from 'mobx';
import sortParticipants from '../utils/sortParticipants';

class ParticipantStore {
  rootStore: any;

  participant?: Participant;

  participants: Participant[] = [];

  sortedParticipants: Participant[] = [];

  selectedParticipant: null | Participant = null;

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setParticipants(participants: Participant[]) {
    this.participants = participants;
    this.sortedParticipants = sortParticipants(participants);
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
}

export default ParticipantStore;
