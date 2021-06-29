import ParticipantsStore from './participantsStore';
import RoomsStore from './roomsStore';

// Enable navigator for jest testing only
if (typeof jest !== 'undefined') {
  require('../mocks/navigator');
  require('../mocks/howler');
}

export class RootStore {
  participantsStore;

  roomsStore;

  constructor() {
    this.participantsStore = new ParticipantsStore(this);
    this.roomsStore = new RoomsStore(this);
  }
}

const rootStore = new RootStore();
export default rootStore;
