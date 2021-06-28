import { act } from '@testing-library/react-hooks';
import { Participant } from 'twilio-video';
import { RootStore } from '../makeStore';
import { mockParticipant } from '../../utils/mocks';

describe('the useParticipants hook', () => {
  let roomStore: any;
  let participantStore: any;
  const participant1 = new mockParticipant('participant1@participant');
  const participant2 = new mockParticipant('participant2@participant');
  beforeEach(() => {
    const rootStore = new RootStore();
    roomStore = rootStore.roomStore;
    participantStore = rootStore.participantStore;

    participantStore.addParticipant(participant1);
    participantStore.addParticipant(participant2);
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant1@participant', 'participant2@participant']);
  });

  it('should return respond to "participantConnected" events', async () => {
    const participant3 = new mockParticipant('participant3@participant');
    act(() => {
      participantStore.addParticipant(participant3);
    });
    const identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual([
      'participant1@participant',
      'participant2@participant',
      'participant3@participant',
    ]);
  });

  it('should return respond to "participantDisconnected" events', async () => {
    act(() => {
      participantStore.removeParticipantSid(participant1.sid);
    });
    const identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant2@participant']);
  });

  it('should reorder participants when the dominant speaker changes', () => {
    const participant3 = new mockParticipant('participant3@participant');
    act(() => {
      participantStore.addParticipant(participant3);
    });
    let identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);

    expect(identitiesArray).toEqual([
      'participant1@participant',
      'participant2@participant',
      'participant3@participant',
    ]);
    act(() => {
      participantStore.setDominantSpeaker('participant2@participant');
    });
    identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual([
      'participant2@participant',
      'participant1@participant',
      'participant3@participant',
    ]);
    act(() => {
      participantStore.setDominantSpeaker('participant3@participant');
    });
    identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual([
      'participant3@participant',
      'participant2@participant',
      'participant1@participant',
    ]);
    participantStore.setDominantSpeaker(null);
    identitiesArray = participantStore.participants.map((participant: Participant) => participant.identity);

    expect(identitiesArray).toEqual([
      'participant3@participant',
      'participant2@participant',
      'participant1@participant',
    ]);
  });

  it('should clean up listeners on unmount', async () => {
    let unmount = () => {};
    await act(async () => {
      unmount = await roomStore.joinRoom();
    });
    unmount();
    expect(roomStore.room.listenerCount('participantConnected')).toBe(0);
    expect(roomStore.room.listenerCount('participantDisconnected')).toBe(0);
  });
});
