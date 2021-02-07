import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import ParticipantConnectionIndicator from '../ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import { ParticipantIdentity } from 'utils/participantIdentity';

const useStyles = makeStyles(theme =>
  createStyles({
    identity: {
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
  })
);

const ParticipantNameTag = ({ participant }) => {
  const classes = useStyles();
  const participantIdentity = ParticipantIdentity.Parse(participant?.identity || participant);

  return (
    <h4 className={classes.identity}>
      {typeof participant === 'string' ? null : <ParticipantConnectionIndicator participant={participant} />}
      {participantIdentity.partyName} ({participantIdentity.partyType}
      {participantIdentity.isRegisteredUser ? '*' : ''})
    </h4>
  );
};

export default ParticipantNameTag;
