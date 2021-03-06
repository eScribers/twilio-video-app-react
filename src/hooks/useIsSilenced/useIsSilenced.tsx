import { useEffect } from 'react';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import useParticipants from '../useParticipants/useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useAppState } from '../useAppState/useAppState';
import useLocalAudioToggle from '../useLocalAudioToggle/useLocalAudioToggle';

const useIsSilenced = () => {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const { isSilenced, setIsSilenced, setNotification } = useAppState();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  const participants = useParticipants();

  useEffect(() => {
    const isReporter = ParticipantIdentity.Parse(localParticipant.identity)['partyType'] === PARTICIPANT_TYPES.REPORTER;
    if (!isReporter) return;

    const isSipClientConnected =
      participants.filter(
        participant =>
          ParticipantIdentity.Parse(participant.identity)['partyType'] === PARTICIPANT_TYPES.REPORTER_RECORDING
      ).length >= 1;

    if (!isSilenced && isSipClientConnected) {
      setNotification({
        message:
          'Dear reporter, a Zoiper call has been connected. You are automatically muted and all incoming audio from this tab is silenced in order to prevent the audio from being played twice. Please mute/unmute yourself directly from Zoiper',
      });
      console.log('You are silenced because of a zoiper call');
      setIsSilenced(true);
      if (isAudioEnabled) toggleAudioEnabled();
    }
    if (isSilenced && !isSipClientConnected) {
      setNotification({ message: 'Zoiper call disconnected. Please unmute yourself' });
      console.log('Zoiper call disconnected, you are un-silenced');
      setIsSilenced(false);
    }
  }, [participants, isSilenced, setIsSilenced, localParticipant, setNotification, isAudioEnabled, toggleAudioEnabled]);

  return [isSilenced, setIsSilenced];
};

export default useIsSilenced;
