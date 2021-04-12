import { useEffect } from 'react';
import { useAppState } from '../../state';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';

const useIsSilenced = () => {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const { isSilenced, setIsSilenced, setNotification } = useAppState();
  const participants = useParticipants();

  useEffect(() => {
    const isReporter = ParticipantIdentity.Parse(localParticipant.identity)['partyType'] === PARTICIPANT_TYPES.REPORTER;
    const isZoiperConnected =
      participants.filter(
        participant =>
          ParticipantIdentity.Parse(participant.identity)['partyType'] === PARTICIPANT_TYPES.REPORTER_RECORDING
      ).length >= 1;

    if (!isSilenced && isReporter && isZoiperConnected) {
      setNotification({
        message:
          'Dear reporter, a Zoiper call has been connected. You are automatically muted and all incoming audio from this tab is silenced in order to prevent the audio from being played twice. Please mute/unmute yourself directly from Zoiper',
      });
      console.log('You are silenced because of a zoiper call');
      setIsSilenced(true);
    }
    if (isSilenced && isReporter && !isZoiperConnected) {
      setNotification({ message: 'Zoiper call disconnected' });
      console.log('Zoiper call disconnected, you are un-silenced');
      setIsSilenced(false);
    }
  }, [participants, isSilenced, setIsSilenced, localParticipant.identity, setNotification]);

  return [isSilenced, setIsSilenced];
};

export default useIsSilenced;
