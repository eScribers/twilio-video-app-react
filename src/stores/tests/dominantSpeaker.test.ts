import { act } from '@testing-library/react-hooks';
import { RootStore } from '../makeStore';

describe('the useDominantSpeaker hook', () => {
  const { roomsStore, participantsStore } = new RootStore();
  let unmount: () => void = () => {};
  beforeAll(async () => {
    unmount = (await roomsStore.joinRoom('token')) as () => {};
  });
  beforeEach(() => {
    participantsStore.setDominantSpeaker('mockDominantSpeaker');
  });

  it('should return room.dominantSpeaker by default', () => {
    expect(participantsStore.dominantSpeaker).toBe('mockDominantSpeaker');
  });

  it('should respond to "dominantSpeakerChanged" events', async () => {
    act(() => {
      roomsStore.room.emit('dominantSpeakerChanged', 'newDominantSpeaker');
    });
    expect(participantsStore.dominantSpeaker).toBe('newDominantSpeaker');
  });

  it('should not set "null" when there is no dominant speaker', () => {
    expect(participantsStore.dominantSpeaker).toBe('mockDominantSpeaker');
    act(() => {
      roomsStore.room.emit('dominantSpeakerChanged', null);
    });
    expect(participantsStore.dominantSpeaker).toBe('mockDominantSpeaker');
  });

  it('should set "null" as the dominant speaker when the dominant speaker disconnects', () => {
    expect(participantsStore.dominantSpeaker).toBe('mockDominantSpeaker');
    act(() => {
      roomsStore.room.emit('participantDisconnected', 'otherParticipant');
    });
    expect(participantsStore.dominantSpeaker).toBe('mockDominantSpeaker');
  });

  it('should not set "null" as the dominant speaker when a different participant disconnects', () => {
    expect(participantsStore.dominantSpeaker).toBe('mockDominantSpeaker');
    act(() => {
      roomsStore.room.emit('participantDisconnected', 'mockDominantSpeaker');
    });
    expect(participantsStore.dominantSpeaker).toBe(null);
  });

  it('should clean up listeners on unmount', () => {
    expect(roomsStore.room.listenerCount('dominantSpeakerChanged')).toBe(1);
    expect(roomsStore.room.listenerCount('participantDisconnected')).toBe(1);
    unmount();
    expect(roomsStore.room.listenerCount('dominantSpeakerChanged')).toBe(0);
    expect(roomsStore.room.listenerCount('participantDisconnected')).toBe(0);
  });
});
