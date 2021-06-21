import React from 'react';
import { observer } from 'mobx-react-lite';
import { styled } from '@material-ui/core/styles';
import Participant from '../../Participant/Participant';
import rootStore from '../../../stores';

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

const ParticipantStripCollaboration = observer(() => {
  const { participantStore } = rootStore;
  const { dominantSpeaker } = participantStore;
  const { sortedParticipants, selectedParticipant } = participantStore;

  if (!participantStore.participant) return null;

  return (
    <Container>
      <ScrollContainer>
        <Participant
          participant={participantStore.participant}
          isSelected={selectedParticipant === participantStore.participant}
          onClick={() => participantStore.setSelectedParticipant(participantStore.participant)}
        />
        {sortedParticipants.map(participant => (
          <Participant
            key={participant.sid}
            isDominantSpeaker={participant.identity === dominantSpeaker}
            participant={participant}
            isSelected={selectedParticipant === participant}
            userIsSilenced={!!participantStore.isSilenced}
            onClick={() => participantStore.setSelectedParticipant(participant)}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
});

export default ParticipantStripCollaboration;
