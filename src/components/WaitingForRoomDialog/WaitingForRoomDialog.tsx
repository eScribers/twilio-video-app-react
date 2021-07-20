import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import rootStore from '../../stores';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(theme =>
  createStyles({
    loadingSpinner: {
      marginLeft: '3em',
    },
  })
);

const WaitingForRoomDialog = () => {
  const classes = useStyles();
  const { roomsStore } = rootStore;
  const message = roomsStore.waitingNotification || '';

  const cancelWait = () => {
    roomsStore.setIsAutoRetryingToJoinRoom(false);
    roomsStore.setWaitingNotification(null);
  };

  return (
    <Dialog open={message.length} onClose={() => cancelWait()} fullWidth={true} maxWidth="xs">
      <DialogTitle>Conference Not Started</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <CircularProgress className={classes.loadingSpinner} />
      <DialogActions>
        <Button onClick={() => cancelWait()} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(WaitingForRoomDialog);
