import { useEffect } from 'react';
import { useAppState } from '../../state';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';

const useIsDeafened = () => {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const { isDeafened, setIsDeafened, setNotification } = useAppState();
  const participants = useParticipants();

  useEffect(() => {
    const isReporter = ParticipantIdentity.Parse(localParticipant.identity)['partyType'] === PARTICIPANT_TYPES.REPORTER;
    const isZoiperConnected =
      participants.filter(
        participant =>
          ParticipantIdentity.Parse(participant.identity)['partyType'] === PARTICIPANT_TYPES.REPORTER_RECORDING
      ).length >= 1;

    if (!isDeafened && isReporter && isZoiperConnected) {
      setNotification({
        message:
          'Dear reporter, a Zoiper call has been connected. You are automatically muted and all incoming audio from this tab is deafened in order to prevent the audio from being played twice. Please mute/unmute yourself directly from Zoiper',
      });
      console.log('You are deafened because of a zoiper call');
      setIsDeafened(true);
    }
    if (isDeafened && isReporter && !isZoiperConnected) {
      setNotification({ message: 'Zoiper call disconnected' });
      console.log('Zoiper call disconnected, you are un-deafened');
      setIsDeafened(false);
    }
  }, [participants, isDeafened, setIsDeafened, localParticipant.identity, setNotification]);

  return [isDeafened, setIsDeafened];
};

export default useIsDeafened;
