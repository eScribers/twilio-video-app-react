import { act } from '@testing-library/react-hooks';
import { RootStore } from '..';

describe('the useDominantSpeaker hook', () => {
  const { roomStore, participantStore } = new RootStore();
  let unmount: () => void = () => {};
  beforeAll(async () => {
    unmount = (await roomStore.joinRoom('token')) as () => {};
  });
  beforeEach(() => {
    participantStore.setDominantSpeaker('mockDominantSpeaker');
  });

  it('should return room.dominantSpeaker by default', () => {
    expect(participantStore.dominantSpeaker).toBe('mockDominantSpeaker');
  });

  it('should respond to "dominantSpeakerChanged" events', async () => {
    act(() => {
      roomStore.room.emit('dominantSpeakerChanged', 'newDominantSpeaker');
    });
    expect(participantStore.dominantSpeaker).toBe('newDominantSpeaker');
  });

  it('should not set "null" when there is no dominant speaker', () => {
    expect(participantStore.dominantSpeaker).toBe('mockDominantSpeaker');
    act(() => {
      roomStore.room.emit('dominantSpeakerChanged', null);
    });
    expect(participantStore.dominantSpeaker).toBe('mockDominantSpeaker');
  });

  it('should set "null" as the dominant speaker when the dominant speaker disconnects', () => {
    expect(participantStore.dominantSpeaker).toBe('mockDominantSpeaker');
    act(() => {
      roomStore.room.emit('participantDisconnected', 'otherParticipant');
    });
    expect(participantStore.dominantSpeaker).toBe('mockDominantSpeaker');
  });

  it('should not set "null" as the dominant speaker when a different participant disconnects', () => {
    expect(participantStore.dominantSpeaker).toBe('mockDominantSpeaker');
    act(() => {
      roomStore.room.emit('participantDisconnected', 'mockDominantSpeaker');
    });
    expect(participantStore.dominantSpeaker).toBe(null);
  });

  it('should clean up listeners on unmount', () => {
    expect(roomStore.room.listenerCount('dominantSpeakerChanged')).toBe(1);
    expect(roomStore.room.listenerCount('participantDisconnected')).toBe(1);
    unmount();
    expect(roomStore.room.listenerCount('dominantSpeakerChanged')).toBe(0);
    expect(roomStore.room.listenerCount('participantDisconnected')).toBe(0);
  });
});
