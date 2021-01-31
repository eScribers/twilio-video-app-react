import React from 'react';
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import { VIEW_MODE } from '../../state/settings/settingsReducer';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '../Participant/Participant';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    height: '100%',
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

const Container = styled('aside')(({ theme }) => ({
  padding: '0.5em',
  overflowY: 'auto',
  [theme.breakpoints.down('xs')]: {
    overflowY: 'initial',
    overflowX: 'auto',
    padding: 0,
    display: 'flex',
  },
}));

const ScrollContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    display: 'flex',
  },
}));

// const ScrollGrid = styled('div')(({ theme }) => ({
//   [theme.breakpoints.down('xs')]: {
//     display: 'flex',
//   },
// }));

interface ParticipantStripProps {
  viewMode: string;
}
export default function ParticipantStrip({ viewMode }: ParticipantStripProps) {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  const classes = useStyles();

  return viewMode === VIEW_MODE.grid ? (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4} sm={4} md={4} lg={4} className={classes.scrollable}>
          <Paper className={classes.paper}>
            <Participant
              gridView={true}
              participant={localParticipant}
              isSelected={selectedParticipant === localParticipant}
              onClick={() => setSelectedParticipant(localParticipant)}
            />
          </Paper>
        </Grid>
        {participants.map((participant: any) => (
          <Grid key={participant.sid} item xs={4} sm={4} md={4} lg={4} className={classes.scrollable}>
            <Paper className={classes.paper}>
              <Participant
                gridView={true}
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
  ) : (
    <Container>
      <ScrollContainer>
        <Participant
          participant={localParticipant}
          isSelected={selectedParticipant === localParticipant}
          onClick={() => setSelectedParticipant(localParticipant)}
        />
        {participants.map(participant => (
          <Participant
            key={participant.sid}
            participant={participant}
            isSelected={selectedParticipant === participant}
            onClick={() => setSelectedParticipant(participant)}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
}
