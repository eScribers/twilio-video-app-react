import { RootStore } from '../makeStore';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import { act } from '@testing-library/react';

describe('the useMainParticipant hook', () => {
  let roomStore: any;
  let participantStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomStore = rootStore.roomStore;
    participantStore = rootStore.participantStore;
  });

  it('should return the dominant speaker if it exists', () => {
    const localParticipant = new mockLocalParticipant();
    const participant = new mockParticipant();
    act(() => {
      participantStore.setDominantSpeaker(participant.identity);
      participantStore.setParticipant(localParticipant);
    });
    expect(participantStore.dominantSpeaker).toBe(participant.identity);
  });

  it('should return the first remote participant if it exists', () => {
    const localParticipant = new mockLocalParticipant();
    const participant1 = new mockParticipant('participant1@participant');
    const participant2 = new mockParticipant('participant2@participant');
    act(() => {
      participantStore.addParticipant(participant1);
      participantStore.addParticipant(participant2);
      participantStore.setParticipant(localParticipant);
    });
    expect(participantStore.dominantSpeaker).toBe('participant1@participant');
  });

  it('should return the local participant if it exists', () => {
    const localParticipant = new mockLocalParticipant('localParticipant@participant');
    act(() => {
      participantStore.setParticipant(localParticipant);
    });
    expect(participantStore.dominantSpeaker).toBe('localParticipant@participant');
  });

  it('should return the selected participant if it exists', () => {
    const localParticipant = new mockLocalParticipant();
    const participant1 = new mockParticipant('participant1@participant');
    const participant2 = new mockParticipant('selected@participant');
    act(() => {
      participantStore.addParticipant(participant1);
      participantStore.addParticipant(participant2);
      participantStore.setParticipant(localParticipant);
      participantStore.setSelectedParticipant(participant2.identity);
    });
    expect(participantStore.mainParticipant).toBe('selected@participant');
  });
});
