import ParticipantStore from './participantStore';
import RoomStore from './roomStore';
import EventStore from './eventStore';

// Enable navigator for jest testing only
if (typeof jest !== 'undefined') {
  require('../mocks/navigator');
  require('../mocks/howler');
}

export class RootStore {
  participantStore: ParticipantStore;

  roomStore: RoomStore;

  eventStore: EventStore;

  constructor() {
    this.participantStore = new ParticipantStore(this);
    this.roomStore = new RoomStore(this);
    this.eventStore = new EventStore(this);
  }
}

const rootStore = new RootStore();
export default rootStore;
