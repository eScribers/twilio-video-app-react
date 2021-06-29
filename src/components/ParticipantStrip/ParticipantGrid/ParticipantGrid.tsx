import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Participant from '../../Participant/Participant';
import rootStore from '../../../stores';

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

export interface ParticipantGridProps {
  viewMode: string;
}

const ParticipantGrid = observer(({ viewMode }: ParticipantGridProps) => {
  const { participantsStore } = rootStore;
  const [currViewMode, setCurrViewMode] = useState('');
  const [lgState, setLgState] = useState<any>(3);
  const [mdState, setMdState] = useState<any>(4);
  const { sortedParticipants, selectedParticipant, participant: localParticipant } = participantsStore;
  const classes = useStyles();

  const dominantIdentity = participantsStore.dominantSpeaker;

  useEffect(() => {
    if (currViewMode !== viewMode) {
      if (viewMode.includes('2 column')) {
        setMdState(6);
        setLgState(6);
      } else if (viewMode.includes('3 column')) {
        setMdState(4);
        setLgState(4);
      } else if (viewMode.includes('4 column')) {
        setMdState(3);
        setLgState(3);
      } else {
        setMdState(4);
        setLgState(3);
      }
      setCurrViewMode(viewMode);
    }
  }, [viewMode, currViewMode]);

  if (!localParticipant) return null;
  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.scrollable}>
        <Grid item xs={12} sm={6} md={mdState} lg={lgState}>
          <Paper className={classes.paper}>
            <Participant
              participant={localParticipant}
              isSelected={selectedParticipant === localParticipant.identity}
              onClick={() => participantsStore.setSelectedParticipant(localParticipant.identity)}
            />
          </Paper>
        </Grid>
        {sortedParticipants.map((participant: any) => (
          <Grid key={participant.sid} item xs={12} sm={6} md={mdState} lg={lgState}>
            <Paper className={classes.paper}>
              <Participant
                key={participant.sid}
                participant={participant}
                isSelected={selectedParticipant === participant}
                isDominantSpeaker={dominantIdentity === participant.identity}
                userIsSilenced={!!participantsStore.isSilenced}
                onClick={() => participantsStore.setSelectedParticipant(participant.identity)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default ParticipantGrid;
