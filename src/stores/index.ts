import ParticipantStore from './participantStore';

class RootStore {
  participantStore: ParticipantStore;

  constructor() {
    this.participantStore = new ParticipantStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
