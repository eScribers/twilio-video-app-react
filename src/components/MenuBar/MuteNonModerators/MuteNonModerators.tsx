import React, { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import useParticipants from 'hooks/useParticipants/useParticipants';
import roleChecker from 'utils/rbac/roleChecker';
import { ROLE_PERMISSIONS } from 'utils/rbac/rolePermissions';
import { ParticipantIdentity } from 'utils/participantIdentity';
import { RemoteParticipant } from 'twilio-video';
import useParticipant from 'hooks/useParticipant/useParticipant';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';

const MuteNonModerators = ({ onClick }) => {
  const {
    room: { localParticipant },
  } = useVideoContext();

  const participants = useParticipants();
  const participantCommands = useParticipant();
  const [muteable, setMuteable] = useState<RemoteParticipant[]>([]);

  useEffect(() => {
    const localParticipantType: string = ParticipantIdentity.Parse(localParticipant.identity).partyType;
    let muteableParticipants: RemoteParticipant[] = [];
    participants.map(participant => {
      let remoteParticipantPartyType = ParticipantIdentity.Parse(participant.identity).partyType;
      if (localParticipantType === remoteParticipantPartyType) return;
      if (
        roleChecker.doesRoleHavePermission(
          ROLE_PERMISSIONS.MUTE_PARTICIPANT,
          localParticipantType,
          remoteParticipantPartyType
        )
      )
        muteableParticipants.push(participant);
    });
    setMuteable(muteableParticipants);
  }, [participants]);

  const sendMuteCommand = () => {
    muteable.map(participant => {
      participantCommands.muteParticipant(participant);
    });
    onClick();
  };

  return !muteable.length ? null : <MenuItem onClick={sendMuteCommand}>Mute non-moderators</MenuItem>;
};

export default MuteNonModerators;
