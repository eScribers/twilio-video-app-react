import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import ChatLine from './ChatLine';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    createDiscussion: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 30px',
      background: '#303030',
      cursor: 'pointer',
      '&:hover': {
        background: '#555555',
      },
    },
    button: {
      color: 'white',
      backgroundColor: '#303030',
    },
  })
);

const CreateDiscussion = ({ participants, me }) => {
  const classes = useStyles();
  const [createDiscussionDialog, setCreateDiscussionDialog] = useState(false);

  return (
    <>
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
          <Button className={classes.button} onClick={() => setCreateDiscussionDialog(false)} color="primary">
            Create conversation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDiscussion;
