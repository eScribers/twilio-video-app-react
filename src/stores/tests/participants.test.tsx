import { act } from '@testing-library/react-hooks';
import { Participant } from 'twilio-video';
import { RootStore } from '../makeStore';
import { mockParticipant } from '../../utils/mocks';

describe('the useParticipants hook', () => {
  let roomsStore: any;
  let participantsStore: any;
  const participant1 = new mockParticipant('participant1@participant');
  const participant2 = new mockParticipant('participant2@participant');
  beforeEach(() => {
    const rootStore = new RootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;

    participantsStore.addParticipant(participant1);
    participantsStore.addParticipant(participant2);
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant1@participant', 'participant2@participant']);
  });

  it('should return respond to "participantConnected" events', async () => {
    const participant3 = new mockParticipant('participant3@participant');
    act(() => {
      participantsStore.addParticipant(participant3);
    });
    const identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual([
      'participant1@participant',
      'participant2@participant',
      'participant3@participant',
    ]);
  });

  it('should return respond to "participantDisconnected" events', async () => {
    act(() => {
      participantsStore.removeParticipantSid(participant1.sid);
    });
    const identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant2@participant']);
  });

  it('should reorder participants when the dominant speaker changes', () => {
    const participant3 = new mockParticipant('participant3@participant');
    act(() => {
      participantsStore.addParticipant(participant3);
    });
    let identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);

    expect(identitiesArray).toEqual([
      'participant1@participant',
      'participant2@participant',
      'participant3@participant',
    ]);
    act(() => {
      participantsStore.setDominantSpeaker('participant2@participant');
    });
    identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual([
      'participant2@participant',
      'participant1@participant',
      'participant3@participant',
    ]);
    act(() => {
      participantsStore.setDominantSpeaker('participant3@participant');
    });
    identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual([
      'participant3@participant',
      'participant2@participant',
      'participant1@participant',
    ]);
    participantsStore.setDominantSpeaker(null);
    identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);

    expect(identitiesArray).toEqual([
      'participant3@participant',
      'participant2@participant',
      'participant1@participant',
    ]);
  });

  it('should clean up listeners on unmount', async () => {
    let unmount = () => {};
    await act(async () => {
      unmount = await roomsStore.joinRoom();
    });
    unmount();
    expect(roomsStore.currentRoom.listenerCount('participantConnected')).toBe(0);
    expect(roomsStore.currentRoom.listenerCount('participantDisconnected')).toBe(0);
  });
});
