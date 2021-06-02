import { Participant } from 'twilio-video';
import { makeAutoObservable } from 'mobx';
import sortParticipants from '../utils/sortParticipants';

class ParticipantStore {
  rootStore: any;

  participant?: Participant;

  participants: Participant[] = [];

  sortedParticipants: Participant[] = [];

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!test');
  }

  setParticipants(participants: Participant[]) {
    this.participants = participants;
    this.sortedParticipants = sortParticipants(participants);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!set', participants);
  }

  addParticipant(participant: Participant) {
    this.setParticipants([...this.participants, participant]);
  }

  removeParticipantSid(participantSid: string) {
    this.setParticipants([...this.participants.filter(p => p.sid !== participantSid)]);
  }
}

export default ParticipantStore;
