import { makeAutoObservable } from 'mobx';
import { EventTypes, IEvent } from '../components/EventFeed/Event/types';

class EventStore {
  rootStore: any;

  events: IEvent[] = [];

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async sendMessage(message: string) {
    const identity = this.rootStore.participantStore.participant?.identity;

    if (!identity) throw new Error('No participant detected');
    // if() throw new Error('Sync not connected yet');
    if (message.length === 0) return;
    console.log(identity);

    const newEvent = {
      type: EventTypes.message,
      time: new Date(),
      data: {
        text: message,
        user: identity,
      },
    };

    // {
    //   type: EventTypes.event,
    //   time: new Date(),
    //   data: {
    //     text: 'went off record',
    //     user: 'Gal',
    //   },
    // },

    // We should send a sync message, but in the meantime
    this.setEvents([...this.events, newEvent]);
  }

  setEvents(events: IEvent[]) {
    this.events = events;
  }
}

export default EventStore;
