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
    const localParticipant = new mockLocalParticipant();
    const participant = new mockParticipant();
    act(() => {
      participantsStore.setDominantSpeaker(participant.identity);
      participantsStore.setParticipant(localParticipant);
    });
    expect(participantsStore.dominantSpeaker).toBe(participant.identity);
  });

  it('should return the first remote participant if it exists', () => {
    const localParticipant = new mockLocalParticipant();
    const participant1 = new mockParticipant('participant1@participant');
    const participant2 = new mockParticipant('participant2@participant');
    act(() => {
      participantsStore.addParticipant(participant1);
      participantsStore.addParticipant(participant2);
      participantsStore.setParticipant(localParticipant);
    });
    expect(participantsStore.dominantSpeaker).toBe('participant1@participant');
  });

  it('should return the local participant if it exists', () => {
    const localParticipant = new mockLocalParticipant('localParticipant@participant');
    act(() => {
      participantsStore.setParticipant(localParticipant);
    });
    expect(participantsStore.dominantSpeaker).toBe('localParticipant@participant');
  });

  it('should return the selected participant if it exists', () => {
    const localParticipant = new mockLocalParticipant();
    const participant1 = new mockParticipant('participant1@participant');
    const participant2 = new mockParticipant('selected@participant');
    act(() => {
      participantsStore.addParticipant(participant1);
      participantsStore.addParticipant(participant2);
      participantsStore.setParticipant(localParticipant);
      participantsStore.setSelectedParticipant(participant2.identity);
    });
    expect(participantsStore.mainParticipant).toBe('selected@participant');
  });
});
