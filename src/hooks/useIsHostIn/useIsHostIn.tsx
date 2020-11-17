import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import { Callback } from '../../types';
import { NOTIFICATION_MESSAGE } from '../../utils/displayStrings';

export default function useIsHostIn(onNotification: Callback) {
  const { room } = useVideoContext();
  const [isHostIn, setIsHostIn] = useState(true);

  useEffect(() => {
    if (!useIsHostIn()) {
      onNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
      setIsHostIn(false);
    }
  }, [room]);

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        onNotification({ message: NOTIFICATION_MESSAGE.REPORTER_HAS_JOINED });
        setIsHostIn(true);
      }
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER && !useIsHostIn()) {
        onNotification({ message: NOTIFICATION_MESSAGE.WAITING_FOR_REPORTER });
        setIsHostIn(false);
      }
    };

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return isHostIn;

  function useIsHostIn() {
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
}
