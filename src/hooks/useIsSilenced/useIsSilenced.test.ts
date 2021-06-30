import { act } from '@testing-library/react-hooks';
import { RootStore } from '../../stores/makeStore';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';

describe('the useIsSilenced hook', () => {
  let roomsStore: any;
  let participantsStore: any;

  beforeEach(() => {
    const rootStore = new RootStore();
    roomsStore = rootStore.roomsStore;
    participantsStore = rootStore.participantsStore;
  });

  it('when there are no participants yet should return false', () => {
    expect(participantsStore.isSilenced).toBe(false);
  });

  it('should return false when "participantConnected" is not the reporter', async () => {
    let recordingParticipant = new mockParticipant(`newParticipant@${PARTICIPANT_TYPES.REPORTER_RECORDING}`);
    act(() => {
      participantsStore.localParticipant?.setParticipant(new mockLocalParticipant());
      participantsStore.addParticipant(recordingParticipant);
    });
    expect(participantsStore.isSilenced).toBe(true);
    act(() => {
      participantsStore.removeParticipantSid(recordingParticipant.sid);
    });
    expect(participantsStore.isSilenced).toBe(false);
  });
});
