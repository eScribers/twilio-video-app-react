import { act } from '@testing-library/react-hooks';
import { RootStore } from '..';
import { sleep } from '../../utils';
import { mockParticipant } from '../../utils/mocks';

const participant1 = new mockParticipant('participant1');
const participant2 = new mockParticipant('participant2');
const participant3 = new mockParticipant('participant3');

describe('the participants logic in store', () => {
  const { roomStore, participantStore } = new RootStore();
  let unmount: () => void = () => {};
  beforeAll(async () => {
    unmount = (await roomStore.joinRoom('token')) as () => {};
  });
  beforeEach(() => {
    participantStore.setParticipants([participant1, participant2]);
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const participantsIdentities = participantStore.participants.map(participant => participant.identity);
    expect(participantsIdentities).toEqual(['participant1', 'participant2']);
  });

  it('should return respond to "participantConnected" events', async () => {
    await act(async () => {
      roomStore.room.emit('participantConnected', new mockParticipant('newParticipant'));
    });
    const participantsIdentities = participantStore.participants.map(participant => participant.identity);
    expect(participantsIdentities).toEqual(['participant1', 'participant2', 'newParticipant']);
  });

  it('should return respond to "participantDisconnected" events', async () => {
    act(() => {
      roomStore.room.emit('participantDisconnected', participant1);
    });
    const participantsIdentities = participantStore.participants.map(participant => participant.identity);
    expect(participantsIdentities).toEqual(['participant2']);
  });

  it('should reorder participants when the dominant speaker changes', async () => {
    act(() => {
      participantStore.setParticipants([participant1, participant2, participant3]);
    });
    let participantsIdentities = participantStore.participants.map(participant => participant.identity);

    expect(participantsIdentities).toEqual(['participant1', 'participant2', 'participant3']);
    participantStore.setDominantSpeaker('participant2');
    participantsIdentities = participantStore.participants.map(participant => participant.identity);
    expect(participantsIdentities).toEqual(['participant2', 'participant1', 'participant3']);
    participantStore.setDominantSpeaker('participant3');
    participantsIdentities = participantStore.participants.map(participant => participant.identity);
    expect(participantsIdentities).toEqual(['participant3', 'participant2', 'participant1']);
    participantStore.setDominantSpeaker(null);
    participantsIdentities = participantStore.participants.map(participant => participant.identity);
    expect(participantsIdentities).toEqual(['participant3', 'participant2', 'participant1']);
  });

  it('should clean up listeners on unmount', () => {
    unmount();
    expect(roomStore.room.listenerCount('participantConnected')).toBe(0);
    expect(roomStore.room.listenerCount('participantDisconnected')).toBe(0);
  });
});
