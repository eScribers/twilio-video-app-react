import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChatLine from './ChatLine';
import CreateDiscussion from './CreateDiscussion';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    participantsList: {
      position: 'relative',
    },
  })
);

const ParticipantsList = ({ me, participants, chats }) => {
  const classes = useStyles();

  return (
    <div className={classes.participantsList}>
      <ChatLine participants={['All']} />
      {chats.map(({ participants }, key) => (
        <ChatLine participants={participants} me={me} key={key} />
      ))}
      <CreateDiscussion participants={participants} me={me} />
    </div>
  );
};

ParticipantsList.defaultProps = {
  me: 'Gal',
  participants: ['Gal', 'Tal', 'Daniel', 'Gil', 'Jonnie'],
  chats: [
    {
      messages: [],
      participants: ['Gal', 'Tal'],
    },
    {
      messages: [],
      participants: ['Gal', 'Tal', 'Daniel', 'Gil'],
    },
    {
      messages: [],
      participants: ['Gal', 'Jonnie'],
    },
  ],
};

export default ParticipantsList;
