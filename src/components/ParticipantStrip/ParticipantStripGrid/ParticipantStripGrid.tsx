import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '../../Participant/Participant';
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
    flexWrap: 'nowrap',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  scrollable: {
    overflow: 'auto',
  },
}));

export interface ParticipantStripGridProps {
  viewMode: string;
}
export default function ParticipantStripGrid({ viewMode }: ParticipantStripGridProps) {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const [currViewMode, setCurrViewMode] = useState('');
  const [lgState, setLgState] = useState<any>(4);
  const [mdState, setMdState] = useState<any>(3);
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  useEffect(() => {
    if (currViewMode != viewMode) {
      if (viewMode.includes('3X3')) {
        setMdState(4);
        setLgState(4);
      } else if (viewMode.includes('4X4')) {
        setMdState(3);
        setLgState(3);
      } else if (viewMode.includes('2X2')) {
        setMdState(6);
        setLgState(6);
      }
      setCurrViewMode(viewMode);
    }
  }, [viewMode]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.scrollable}>
        <Grid item xs={12} sm={6} md={mdState} lg={lgState}>
          <Paper className={classes.paper}>
            <Participant
              participant={localParticipant}
              isSelected={selectedParticipant === localParticipant}
              onClick={() => setSelectedParticipant(localParticipant)}
            />
          </Paper>
        </Grid>
        {participants.map((participant: any) => (
          <Grid key={participant.sid} item xs={12} sm={6} md={mdState} lg={lgState}>
            <Paper className={classes.paper}>
              <Participant
                key={participant.sid}
                participant={participant}
                isSelected={selectedParticipant === participant}
                onClick={() => setSelectedParticipant(participant)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
