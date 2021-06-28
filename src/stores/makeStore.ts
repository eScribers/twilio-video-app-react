import ParticipantStore from './participantStore';
import RoomStore from './roomStore';

// Enable navigator for jest testing only
if (typeof jest !== 'undefined') {
  require('../mocks/navigator');
  require('../mocks/howler');
}

export class RootStore {
  participantStore: ParticipantStore;

  roomStore: RoomStore;

  constructor() {
    this.participantStore = new ParticipantStore(this);
    this.roomStore = new RoomStore(this);
  }
}

const rootStore = new RootStore();
export default rootStore;
