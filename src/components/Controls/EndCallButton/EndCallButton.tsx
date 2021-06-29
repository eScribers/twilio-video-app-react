import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores';
import roleChecker from '../../../utils/rbac/roleChecker';
import { ROLE_PERMISSIONS } from '../../../utils/rbac/rolePermissions';
import { Dialog } from '@material-ui/core';
import { Button } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { ParticipantIdentity } from '../../../utils/participantIdentity';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
    buttonWrapper: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    button: {
      marginBottom: '10px',
    },
  })
);

const EndCallButton = observer(() => {
  const [modalOpen, setModalOpen] = useState(false);
  const { roomStore, participantStore } = rootStore;
  const classes = useStyles();

  let canEndConference = false;
  if (participantStore.participant?.identity) {
    const role = ParticipantIdentity.Parse(participantStore.participant.identity).partyType;

    canEndConference = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.END_CONFERENCE, role);
  }

  const handleClick = () => {
    if (!canEndConference) {
      roomStore.room.disconnect();

      return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <Tooltip
        id="endCall"
        title={'End Call'}
        onClick={handleClick}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <Fab className={classes.fab} color="primary">
          <CallEnd />
        </Fab>
      </Tooltip>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogContent>
          <div className={classes.buttonWrapper}>
            <Button
              className={classes.button}
              variant="outlined"
              size="medium"
              id="leave_conference"
              onClick={() => roomStore.room.disconnect()}
            >
              Leave conference
            </Button>
            <Button
              className={classes.button}
              variant="outlined"
              size="medium"
              id="end_conference"
              onClick={() => roomStore.endConference()}
              color="secondary"
            >
              End conference
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default EndCallButton;
