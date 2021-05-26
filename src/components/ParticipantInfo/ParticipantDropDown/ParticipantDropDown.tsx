import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Participant } from 'twilio-video';
import useParticipant from '../../../hooks/useParticipant/useParticipant';
import roleChecker from '../../../utils/rbac/roleChecker';
import { ROLE_PERMISSIONS } from '../../../utils/rbac/rolePermissions';
import { ParticipantIdentity } from '../../../utils/participantIdentity';
interface ParticipantDropDownProps {
  localParticipantType: string;
  participant: Participant;
  isAudioEnabled: boolean;
}

const [REMOVE, MUTE] = ['Remove', 'Mute'];
const ITEM_HEIGHT = 48;

export default function ParticipantDropDown({
  localParticipantType,
  participant,
  isAudioEnabled,
}: ParticipantDropDownProps) {
  const options = getParticipantOptions(participant, localParticipantType, !isAudioEnabled);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const participantCommands = useParticipant();

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, option) => {
    event.stopPropagation();
    setAnchorEl(null);

    if (option === MUTE) participantCommands.muteParticipant(participant);

    if (option === REMOVE) participantCommands.removeParticipant(participant);
  };

  return (
    <div hidden={options.length === 0} style={{ position: 'absolute', right: '0', bottom: '10px' }}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        style={{
          padding: '0 5px',
        }}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option} onClick={event => handleClose(event, option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export const getParticipantOptions = (
  participant: Participant,
  localParticipantType: string,
  isTrackMuted: boolean = false
) => {
  let options: string[] = [];
  let remoteParticipantPartyType = ParticipantIdentity.Parse(participant.identity).partyType;
  if (localParticipantType === remoteParticipantPartyType) return options;

  const canMute = roleChecker.doesRoleHavePermission(
    ROLE_PERMISSIONS.MUTE_PARTICIPANT,
    localParticipantType,
    remoteParticipantPartyType
  );
  const canRemove = roleChecker.doesRoleHavePermission(
    ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
    localParticipantType,
    remoteParticipantPartyType
  );

  if (canMute && !isTrackMuted) options.push(MUTE);
  if (canRemove) options.push(REMOVE);
  return options;
};
