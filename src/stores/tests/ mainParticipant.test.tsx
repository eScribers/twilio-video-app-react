import { RootStore } from '../makeStore';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import { act } from '@testing-library/react';

describe('the useMainParticipant hook', () => {
  let roomsStore: any;
  let participantsStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;
  });

  it('should return the dominant speaker if it exists', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    const participant = new mockParticipant('remote', 'Reporter', 2);
    act(() => {
      participantsStore.setDominantSpeaker(participant.identity);
      participantsStore.localParticipant?.setParticipant(localParticipant);
    });
    expect(participantsStore.dominantSpeaker).toBe(participant.identity);
  });

  it('should return the first remote participant if it exists', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    const participant1 = new mockParticipant('participant1', 'Reporter', 1, '1');
    const participant2 = new mockParticipant('participant2', 'Reporter', 2, '2');
    act(() => {
      participantsStore.addParticipant(participant1);
      participantsStore.addParticipant(participant2);
      participantsStore.localParticipant?.setParticipant(localParticipant);
    });
    expect(participantsStore.dominantSpeaker).toBe('participant1@Reporter@1');
  });

  it('should return the local participant if it exists', () => {
    const localParticipant = new mockLocalParticipant('localParticipant', 'participant', 1);
    act(() => {
      participantsStore.localParticipant?.setParticipant(localParticipant);
    });
    expect(participantsStore.dominantSpeaker).toBe('localParticipant@participant@1');
  });

  it('should return the selected participant if it exists', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    const participant1 = new mockParticipant('participant1', 'Reporter', 1, '1');
    const participant2 = new mockParticipant('participant2', 'Reporter', 2, '2');
    act(() => {
      participantsStore.addParticipant(participant1);
      participantsStore.addParticipant(participant2);
      participantsStore.localParticipant?.setParticipant(localParticipant);
      participantsStore.setSelectedParticipant(participant2.identity);
    });
    expect(participantsStore.mainParticipant).toBe('participant2@Reporter@2');
  });
});
