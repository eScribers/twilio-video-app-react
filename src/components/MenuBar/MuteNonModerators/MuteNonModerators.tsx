import React, { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import roleChecker from '../../../utils/rbac/roleChecker';
import { ROLE_PERMISSIONS } from '../../../utils/rbac/rolePermissions';
import { ParticipantIdentity } from '../../../utils/participantIdentity';
import useParticipant from '../../../hooks/useParticipant/useParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { Participant } from 'twilio-video';

const MuteNonModerators = ({ onClick }) => {
  const {
    room: { localParticipant },
  } = useVideoContext();

  const participants = useParticipants();
  const participantCommands = useParticipant();
  const [muteable, setMuteable] = useState<Participant[]>([]);

  const localIdentity = localParticipant?.identity;

  useEffect(() => {
    if (!localIdentity) return;
    const localParticipantType: string = ParticipantIdentity.Parse(localIdentity).partyType;
    let muteableParticipants: Participant[] = [];
    participants.map(participant => {
      let remoteParticipantPartyType = ParticipantIdentity.Parse(participant.identity).partyType;
      if (localParticipantType === remoteParticipantPartyType) return true;
      if (
        roleChecker.doesRoleHavePermission(
          ROLE_PERMISSIONS.MUTE_PARTICIPANT,
          localParticipantType,
          remoteParticipantPartyType
        )
      )
        muteableParticipants.push(participant);
      return true;
    });
    setMuteable(muteableParticipants);
  }, [participants, localIdentity]);

  const sendMuteCommand = () => {
    muteable.map(participant => {
      return participantCommands.muteParticipant(participant);
    });
    onClick();
  };

  return !muteable.length ? null : <MenuItem onClick={sendMuteCommand}>Mute non-moderators</MenuItem>;
};

export default MuteNonModerators;
