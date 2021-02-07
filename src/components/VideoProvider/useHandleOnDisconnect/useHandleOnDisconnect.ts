import { useEffect } from 'react';
import { Room } from 'twilio-video';
import { ROOM_STATE } from '../../../utils/displayStrings';
import { ParticipantIdentity } from '../../../utils/participantIdentity';
export default function useHandleOnDisconnect(room: Room, onDisconnect: (isRegistered?: boolean) => void) {
  let isRegisteredUser = false;
  if (room?.localParticipant?.identity)
    isRegisteredUser = ParticipantIdentity.Parse(room.localParticipant.identity).isRegisteredUser;

  useEffect(() => {
    room.on(ROOM_STATE.DISCONNECTED, () => {
      onDisconnect(isRegisteredUser);
    });
    return () => {
      room.off(ROOM_STATE.DISCONNECTED, () => {
        onDisconnect(isRegisteredUser);
      });
    };
  }, [room, onDisconnect, isRegisteredUser]);
}
