import React from 'react';
import { styled } from '@material-ui/core/styles';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '../../Participant/Participant';
import useSortedParticipants from '../../../hooks/useSortedParticipants/useSortedParticipants';
import useDominantSpeaker from '../../../hooks/useDominantSpeaker/useDominantSpeaker';

const Container = styled('aside')(({ theme }) => ({
  padding: '0.5em',
  overflowY: 'scroll',
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
export default function ParticipantStripCollaboration() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useSortedParticipants();
  const dominantSpeaker = useDominantSpeaker();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  const dominantIdentity = dominantSpeaker?.identity;

  return (
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
            isDominantSpeaker={participant.identity === dominantIdentity}
            participant={participant}
            isSelected={selectedParticipant === participant}
            onClick={() => setSelectedParticipant(participant)}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
}
