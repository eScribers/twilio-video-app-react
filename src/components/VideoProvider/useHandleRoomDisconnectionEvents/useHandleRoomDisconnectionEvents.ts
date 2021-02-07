import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';
import { ROOM_STATE } from '../../../utils/displayStrings';
import { Callback } from '../../../types';
import { NOTIFICATION_MESSAGE } from '../../../utils/displayStrings';

const ROOM_COMPLETED_ERROR = '53118';

export default function useHandleRoomDisconnectionEvents(room: Room, onError: Callback, onNotification: Callback) {
  useEffect(() => {
    const onDisconnected = (room: Room, error: TwilioError) => {
      if (error) {
        if (`${error.code}` === ROOM_COMPLETED_ERROR) onNotification({ message: NOTIFICATION_MESSAGE.ROOM_COMPLETED });
      }
    };

    room.on(ROOM_STATE.DISCONNECTED, onDisconnected);
    return () => {
      room.off(ROOM_STATE.DISCONNECTED, onDisconnected);
    };
  }, [room, onError, onNotification]);
}
