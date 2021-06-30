import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

const EndCallButton = () => {
  const classes = useStyles();

  return (
    <Tooltip
      id="endCall"
      title={'End Call'}
      onClick={() => rootStore.roomsStore.room.disconnect()}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <Fab className={classes.fab} color="primary">
        <CallEnd />
      </Fab>
    </Tooltip>
  );
};

export default observer(EndCallButton);
