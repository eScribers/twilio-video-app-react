import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import moment from 'moment';
import rootStore from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
    dialInWrapper: {
      margin: '0 20px 0 20px',
    },
    dialIn: {
      margin: 0,
    },
    floatingDebugInfo: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.2)',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '10px',
    },
  })
);

const FloatingDebugInfo = () => {
  const classes = useStyles();
  const { participantsStore } = rootStore;
  const { participantInformation } = participantsStore;

  const subConferenceId = participantInformation?.videoConferenceRoomName;
  return (
    <div className={classes.floatingDebugInfo}>
      {moment().format()} - SC:{subConferenceId}
    </div>
  );
};

export default observer(FloatingDebugInfo);
