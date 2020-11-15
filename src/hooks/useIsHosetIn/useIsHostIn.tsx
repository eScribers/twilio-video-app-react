import { Room } from 'twilio-video';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import { ROOM_STATE } from 'utils/displayStrings';

export default function useIsHostIn() {
  const { room } = useVideoContext();

  if (typeof room.participants !== 'undefined' && room !== null) {
    room.participants.forEach(participant => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        return true;
      }
    });
    if (room.localParticipant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
      return true;
    }

    return false;
  }

  return true;
}
