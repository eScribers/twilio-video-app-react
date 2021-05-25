import { useEffect } from 'react';
import { Room } from 'twilio-video';
import { ROOM_STATE } from '../../../utils/displayStrings';
import { ParticipantIdentity } from '../../../utils/participantIdentity';

const setHandler = (room, isRegisteredUser, onDisconnect) => {
  room.on(ROOM_STATE.DISCONNECTED, () => {
    onDisconnect(isRegisteredUser);
  });
};
const removeHandler = (room, isRegisteredUser, onDisconnect) => {
  room.off(ROOM_STATE.DISCONNECTED, () => {
    onDisconnect(isRegisteredUser);
  });
};

export default function useHandleOnDisconnect(room: Room, onDisconnect: (isRegistered?: boolean) => void) {
  let isRegisteredUser: boolean = false;
  if (room?.localParticipant?.identity)
    isRegisteredUser = ParticipantIdentity.Parse(room.localParticipant.identity).isRegisteredUser;

  useEffect(() => {
    setHandler(room, isRegisteredUser, onDisconnect);
    return () => removeHandler(room, isRegisteredUser, onDisconnect);
    // eslint-disable-next-line
  }, [isRegisteredUser]);
  return [];
}
