import React from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { Participant } from 'twilio-video';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores/rootStore';
import { LocalParticipant } from 'twilio-video';

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
  participant: Participant | LocalParticipant;
}

export const ParticipantNameTag = observer(({ participant }: IParticipantNameTag) => {
  const classes = useStyles();
  const { participantsStore } = rootStore;
  // const {
  //   room: { localParticipant },
  // } = useVideoContext();

  const isLocalParticipant = participant.identity === participantsStore.localParticipant?.participant?.identity;
  const { role, isRegisteredUser, partyName } = ParticipantIdentity.Parse(participant.identity);

  return (
    <Typography variant="body1" className={classes.typeography} component="span">
      {role}
      {partyName && ` - ${partyName}`}
      {isRegisteredUser ? ' *' : null}
      {isLocalParticipant && ' (You)'}
    </Typography>
  );
});
