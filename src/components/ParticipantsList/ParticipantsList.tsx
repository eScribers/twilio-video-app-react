import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChatLine from './ChatLine';
import Modal from '@material-ui/core/Modal';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    participantsList: {
      position: 'relative',
    },
    createDiscussion: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      padding: '10px 30px',
      background: '#303030',
      cursor: 'pointer',
      '&:hover': {
        background: '#555555',
      },
    },
  })
);

const ParticipantsList = ({ me, participants, chats }) => {
  const classes = useStyles();
  const [createDiscussionDialog, setCreateDiscussionDialog] = useState(false);

  return (
    <div className={classes.participantsList}>
      <ChatLine participants={['All']} />
      {chats.map(({ participants }, key) => (
        <ChatLine participants={participants} me={me} key={key} />
      ))}
      <div className={classes.createDiscussion} onClick={() => setCreateDiscussionDialog(true)}>
        Create discussion
      </div>
      <Dialog
        onClose={() => setCreateDiscussionDialog(false)}
        aria-labelledby="simple-dialog-title"
        open={createDiscussionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="simple-dialog-title">Select participants</DialogTitle>
        <DialogContent dividers>
          {participants
            .filter(v => v !== me)
            .map((participant, key) => (
              <ChatLine participants={[participant]} key={key} />
            ))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setCreateDiscussionDialog(false)} color="primary">
            Create conversation
          </Button>
        </DialogActions>
      </Dialog>
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
