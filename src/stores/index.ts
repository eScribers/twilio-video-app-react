import ParticipantStore from './participantStore';
import RoomStore from './roomStore';

class RootStore {
  participantStore: ParticipantStore;

  roomStore: RoomStore;

  constructor() {
    this.participantStore = new ParticipantStore(this);
    this.roomStore = new RoomStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
