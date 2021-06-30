import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';
import { ROOM_STATE } from '../../utils/displayStrings';
import rootStore from '../../stores';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles({
  snackbar: {
    backgroundColor: '#6db1ff',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.8em',
  },
});

const ReconnectingNotification = observer(() => {
  const classes = useStyles();
  const { roomsStore } = rootStore;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={roomsStore.roomState === ROOM_STATE.RECONNECTING}
    >
      <SnackbarContent
        className={classes.snackbar}
        message={
          <span className={classes.message}>
            <InfoIcon className={classes.icon} />
            Reconnecting&hellip;
          </span>
        }
      />
    </Snackbar>
  );
});

export default ReconnectingNotification;
