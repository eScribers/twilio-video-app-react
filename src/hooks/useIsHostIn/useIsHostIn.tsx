import { DOE_PARTICIPANT_TYPES } from '../../utils/rbac/ParticipantTypes';
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
    const participantConnected = (participant: RemoteParticipant) => {
      if (ParticipantIdentity.Parse(participant.identity).partyType === DOE_PARTICIPANT_TYPES.REPORTER) {
        setIsHostIn(true);
        setReporterIn(true);
      }
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (ParticipantIdentity.Parse(participant.identity).partyType === DOE_PARTICIPANT_TYPES.REPORTER) {
        setReporterIn(false);
        if (!checkIsHostIn(room)) setIsHostIn(false);
      }
    };

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return { isHostIn, isReporterIn };

  function checkIsHostIn(theRoom: Room) {
    if (theRoom !== null && typeof theRoom.participants !== 'undefined') {
      let flag = false;
      theRoom.participants.forEach(participant => {
        if (ParticipantIdentity.Parse(participant.identity).partyType === DOE_PARTICIPANT_TYPES.REPORTER) {
          flag = true;
        }
      });
      if (
        ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === DOE_PARTICIPANT_TYPES.REPORTER ||
        ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === DOE_PARTICIPANT_TYPES.HEARING_OFFICER
      ) {
        flag = true;
      }

      return flag;
    }

    return true;
  }

  function checkIsReporterIn(theRoom: Room) {
    if (theRoom !== null && typeof theRoom.participants !== 'undefined') {
      let flagIsReporterIn = false;
      theRoom.participants.forEach(participant => {
        if (ParticipantIdentity.Parse(participant.identity).partyType === DOE_PARTICIPANT_TYPES.REPORTER) {
          flagIsReporterIn = true;
        }
      });
      if (ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === DOE_PARTICIPANT_TYPES.REPORTER) {
        flagIsReporterIn = true;
      }

      return flagIsReporterIn;
    }
    return true;
  }
}
