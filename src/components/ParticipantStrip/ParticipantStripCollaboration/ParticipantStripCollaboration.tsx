import React from 'react';
import { observer } from 'mobx-react-lite';
import { styled } from '@material-ui/core/styles';
import Participant from '../../Participant/Participant';
import rootStore from '../../../stores/rootStore';

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

const ParticipantStripCollaboration = () => {
  const { participantsStore } = rootStore;
  const { dominantSpeaker } = participantsStore;
  const { sortedParticipants, selectedParticipant } = participantsStore;

  if (!participantsStore.localParticipant?.participant) return null;

  return (
    <Container>
      <ScrollContainer>
        <Participant
          participant={participantsStore.localParticipant?.participant}
          isSelected={selectedParticipant === participantsStore.localParticipant?.participant.identity}
          onClick={() =>
            participantsStore.localParticipant?.participant &&
            participantsStore.setSelectedParticipant(participantsStore.localParticipant?.participant.identity)
          }
        />
        {sortedParticipants.map(participant => (
          <Participant
            key={participant.sid}
            isDominantSpeaker={participant.identity === dominantSpeaker}
            participant={participant}
            isSelected={selectedParticipant === participant.identity}
            userIsSilenced={!!participantsStore.isSilenced}
            onClick={() => participantsStore.setSelectedParticipant(participant.identity)}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
};

export default observer(ParticipantStripCollaboration);
