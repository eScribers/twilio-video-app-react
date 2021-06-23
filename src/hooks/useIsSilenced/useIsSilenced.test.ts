import { act } from '@testing-library/react-hooks';
import { RootStore } from '../../stores';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';

describe('the useIsSilenced hook', () => {
  let roomStore: any;
  let participantStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomStore = rootStore.roomStore;
    participantStore = rootStore.participantStore;
  });

  it('when there are no participants yet should return false', () => {
    expect(participantStore.isSilenced).toBe(false);
  });

  it('should return false when "participantConnected" is not the reporter', async () => {
    let recordingParticipant = new mockParticipant(`newParticipant@${PARTICIPANT_TYPES.REPORTER_RECORDING}`);
    act(() => {
      participantStore.setParticipant(new mockLocalParticipant());
      participantStore.addParticipant(recordingParticipant);
    });
    expect(participantStore.isSilenced).toBe(true);
    act(() => {
      participantStore.removeParticipantSid(recordingParticipant.sid);
    });
    expect(participantStore.isSilenced).toBe(false);
  });
});
