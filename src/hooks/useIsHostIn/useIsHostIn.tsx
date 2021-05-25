import { PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect, useState } from 'react';
import { RemoteParticipant, Room } from 'twilio-video';
import { ParticipantIdentity } from '../../utils/participantIdentity';

export default function useIsHostIn() {
  const { room } = useVideoContext();
  const [isHostIn, setIsHostIn] = useState(true);
  const [isReporterIn, setReporterIn] = useState(false);

  useEffect(() => {
    if (!checkIsHostIn(room)) {
      setIsHostIn(false);
    }
    if (checkIsReporterIn(room)) setReporterIn(true);
  }, [room]);

  useEffect(() => {
    const participantStatusChanged = (participant: RemoteParticipant) => {
      if (ParticipantIdentity.Parse(participant.identity).partyType === PARTICIPANT_TYPES.REPORTER) {
        setReporterIn(checkIsReporterIn(room));
        setIsHostIn(checkIsHostIn(room));
      }
    };

    room.on('participantConnected', participantStatusChanged);
    room.on('participantDisconnected', participantStatusChanged);
    return () => {
      room.off('participantConnected', participantStatusChanged);
      room.off('participantDisconnected', participantStatusChanged);
    };
  }, [room]);

  return { isHostIn, isReporterIn };
}

function checkIsHostIn(theRoom: Room) {
  if (theRoom !== null && typeof theRoom.participants !== 'undefined') {
    let isHostIn = false;
    theRoom.participants.forEach(participant => {
      if (ParticipantIdentity.Parse(participant.identity).partyType === PARTICIPANT_TYPES.REPORTER) {
        isHostIn = true;
      }
    });
    if (
      ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === PARTICIPANT_TYPES.REPORTER ||
      ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === PARTICIPANT_TYPES.HEARING_OFFICER
    ) {
      isHostIn = true;
    }

    return isHostIn;
  }

  return true;
}

function checkIsReporterIn(theRoom: Room) {
  if (theRoom !== null && typeof theRoom.participants !== 'undefined') {
    let isReporterIn = false;
    theRoom.participants.forEach(participant => {
      if (ParticipantIdentity.Parse(participant.identity).partyType === PARTICIPANT_TYPES.REPORTER) {
        isReporterIn = true;
      }
    });
    if (ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === PARTICIPANT_TYPES.REPORTER) {
      isReporterIn = true;
    }

    return isReporterIn;
  }
  return true;
}
