import EventStore from './eventStore';
import ParticipantsStore from './participantsStore';
import RoomsStore from './roomsStore';

// Enable navigator for jest testing only
if (typeof jest !== 'undefined') {
  require('../mocks/navigator');
  require('../mocks/howler');
}

export class RootStore {
  participantsStore: ParticipantsStore;

  roomsStore: RoomsStore;

  eventStore: EventStore;

  constructor() {
    this.participantsStore = new ParticipantsStore(this);
    this.roomsStore = new RoomsStore(this);
    this.eventStore = new EventStore(this);
  }
}

const rootStore = new RootStore();
export default rootStore;
