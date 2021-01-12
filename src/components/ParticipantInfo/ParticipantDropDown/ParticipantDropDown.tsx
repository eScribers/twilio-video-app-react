import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Participant } from 'twilio-video';
import useParticipant from '../../../hooks/useParticipant/useParticipant';

interface ParticipantDropDownProps {
  participant: Participant;
}

const REMOVE = 'Remove';
const MUTE = 'Mute';
const options = [MUTE, REMOVE];
const ITEM_HEIGHT = 48;

export default function ParticipantDropDown({ participant }: ParticipantDropDownProps) {
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
      //console.log(options.length);
      console.log('attempting to mute now');
      participantCommands.muteParticipant(participant);
    }

    if (option === REMOVE) {
      console.log(participant.sid);
      //console.log(options.length);
      participantCommands.removeParticipant(participant);
    }
  };

  return (
    <div style={{ float: 'right' }}>
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
