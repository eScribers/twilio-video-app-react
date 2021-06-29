import { mockLocalParticipant } from '../../utils/mocks';
import { RootStore } from '../makeStore';

describe('Testing eventStore', () => {
  let rootStore: any;

  beforeEach(() => {
    rootStore = new RootStore();
  });
  it(`Should not send a message when there's no participant connected`, async () => {
    const { eventStore } = rootStore;
    await expect(eventStore.sendMessage('Test')).rejects.toThrow('No participant detected');
  });

  it(`Should send a message when there's a participant connected`, () => {
    const { eventStore, participantStore } = rootStore;
    participantStore.setParticipant(new mockLocalParticipant());
    eventStore.sendMessage('Test');
    expect(eventStore.events[0].data.text).toBe('Test');
  });

  it(`Should not send a message when the message is empty`, () => {
    const { eventStore, participantStore } = rootStore;
    participantStore.setParticipant(new mockLocalParticipant());
    eventStore.sendMessage('');
    expect(eventStore.events.length).toBe(0);
  });

  it(`Should restart the events when asking to restart`, () => {
    const { eventStore, participantStore } = rootStore;
    participantStore.setParticipant(new mockLocalParticipant());
    eventStore.sendMessage('Message');
    expect(eventStore.events.length).toBe(1);
    eventStore.setEvents([]);
    expect(eventStore.events.length).toBe(0);
  });
});
