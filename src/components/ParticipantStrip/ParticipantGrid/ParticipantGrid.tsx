import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '../../Participant/Participant';
// import useSortedParticipants from '../../../hooks/useSortedParticipants/useSortedParticipants';
import useDominantSpeaker from '../../../hooks/useDominantSpeaker/useDominantSpeaker';
import useIsSilenced from '../../../hooks/useIsSilenced/useIsSilenced';
import rootStore from '../../../stores';

const { participantStore } = rootStore;

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
  const {
    room: { localParticipant },
  } = useVideoContext();
  const [currViewMode, setCurrViewMode] = useState('');
  const [lgState, setLgState] = useState<any>(3);
  const [mdState, setMdState] = useState<any>(4);
  const { sortedParticipants } = participantStore;
  const dominantSpeaker = useDominantSpeaker();
  const [isSilenced] = useIsSilenced();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const classes = useStyles();

  const dominantIdentity = dominantSpeaker?.identity;

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
        {sortedParticipants.map((participant: any) => (
          <Grid key={participant.sid} item xs={12} sm={6} md={mdState} lg={lgState}>
            <Paper className={classes.paper}>
              <Participant
                key={participant.sid}
                participant={participant}
                isSelected={selectedParticipant === participant}
                isDominantSpeaker={dominantIdentity === participant.identity}
                userIsSilenced={!!isSilenced}
                onClick={() => setSelectedParticipant(participant)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default ParticipantGrid;
