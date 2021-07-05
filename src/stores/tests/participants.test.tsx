import { act } from '@testing-library/react-hooks';
import { Participant } from 'twilio-video';
import { RootStore } from '../makeStore';
import { mockParticipant } from '../../utils/mocks';

describe('the useParticipants hook', () => {
  let roomsStore: any;
  let participantsStore: any;
  const participant1 = new mockParticipant('participant1', 'Reporter', 1, '1');
  const participant2 = new mockParticipant('participant2', 'Reporter', 2, '2');
  beforeEach(() => {
    const rootStore = new RootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;

    participantsStore.addParticipant(participant1);
    participantsStore.addParticipant(participant2);
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant1@Reporter@1', 'participant2@Reporter@2']);
  });

  it('should return respond to "participantConnected" events', async () => {
    const participant3 = new mockParticipant('participant3', 'Reporter', 3, '3');

    act(() => {
      participantsStore.addParticipant(participant3);
    });
    const identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant1@Reporter@1', 'participant2@Reporter@2', 'participant3@Reporter@3']);
  });

  it('should return respond to "participantDisconnected" events', async () => {
    act(() => {
      participantsStore.removeParticipantSid(participant1.sid);
    });
    const identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant2@Reporter@2']);
  });

  it('should reorder participants when the dominant speaker changes', () => {
    const participant3 = new mockParticipant('participant3', 'Reporter', 3, '3');
    act(() => {
      participantsStore.addParticipant(participant3);
    });
    let identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);

    expect(identitiesArray).toEqual(['participant1@Reporter@1', 'participant2@Reporter@2', 'participant3@Reporter@3']);
    act(() => {
      participantsStore.setDominantSpeaker('participant2@Reporter@2');
    });
    identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant2@Reporter@2', 'participant1@Reporter@1', 'participant3@Reporter@3']);
    act(() => {
      participantsStore.setDominantSpeaker('participant3@Reporter@3');
    });
    identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);
    expect(identitiesArray).toEqual(['participant3@Reporter@3', 'participant2@Reporter@2', 'participant1@Reporter@1']);
    participantsStore.setDominantSpeaker(null);
    identitiesArray = participantsStore.participants.map((participant: Participant) => participant.identity);

    expect(identitiesArray).toEqual(['participant3@Reporter@3', 'participant2@Reporter@2', 'participant1@Reporter@1']);
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
