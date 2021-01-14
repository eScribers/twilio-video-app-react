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
  participant: Participant;
}

const REMOVE = 'Remove';
const MUTE = 'Mute';
const ITEM_HEIGHT = 48;

export default function ParticipantDropDown({ localParticipantType, participant }: any) {
  const initOption = () => {
    let options: string[] = [];
    let remoteParticipantPartyType = ParticipantIdentity.Parse(participant.identity).partyType;
    if (localParticipantType === remoteParticipantPartyType) return options;
    if (
      roleChecker.doesRoleHavePermission(
        ROLE_PERMISSIONS.MUTE_PARTICIPANT,
        localParticipantType,
        remoteParticipantPartyType
      )
    )
      options[0] = MUTE;
    if (
      roleChecker.doesRoleHavePermission(
        ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
        localParticipantType,
        remoteParticipantPartyType
      )
    )
      options[1] = REMOVE;
    return options;
  };
  const options = initOption();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const participantCommands = useParticipant();

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, option) => {
    event.stopPropagation();
    setAnchorEl(null);
    console.log('user chose option: ' + option);

    if (option === MUTE) {
      console.log(participant.sid);
      console.log('attempting to mute now');
      participantCommands.muteParticipant(participant);
    }

    if (option === REMOVE) {
      console.log(participant.sid);
      participantCommands.removeParticipant(participant);
    }
  };
  return (
    <div hidden={options.length === 0} style={{ float: 'right' }}>
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
