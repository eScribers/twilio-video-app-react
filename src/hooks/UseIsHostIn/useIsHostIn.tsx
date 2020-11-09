import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import ParticipantInfo from '../../components/ParticipantInfo/ParticipantInfo';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';

export default function useIsHostIn(participants) {
  participants.forEach(p => {
    if (p.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
      return true;
    }
  });

  return false;
}
