import React from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { Participant } from 'twilio-video';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typeography: {
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
  })
);

interface IParticipantNameTag {
  participant: Participant;
}

export const ParticipantNameTag = ({ participant }: IParticipantNameTag) => {
  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();

  const isLocalParticipant = participant === localParticipant;
  const { partyType, isRegisteredUser, partyName } = ParticipantIdentity.Parse(participant.identity);

  return (
    <Typography variant="body1" className={classes.typeography} component="span">
      {partyType}
      {partyName && ` - ${partyName}`}
      {isRegisteredUser ? ' *' : null}
      {isLocalParticipant && ' (You)'}
    </Typography>
  );
};
