import React from 'react';
import { observer } from 'mobx-react-lite';
import { styled } from '@material-ui/core/styles';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '../../Participant/Participant';
import useIsSilenced from '../../../hooks/useIsSilenced/useIsSilenced';
// import useSortedParticipants from '../../../hooks/useSortedParticipants/useSortedParticipants';
import useDominantSpeaker from '../../../hooks/useDominantSpeaker/useDominantSpeaker';
import rootStore from '../../../stores';

const { participantStore } = rootStore;

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
  const {
    room: { localParticipant },
  } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const { sortedParticipants, selectedParticipant } = participantStore;

  const [isSilenced] = useIsSilenced();

  const dominantIdentity = dominantSpeaker?.identity;

  return (
    <Container>
      <ScrollContainer>
        <Participant
          participant={localParticipant}
          isSelected={selectedParticipant === localParticipant}
          onClick={() => participantStore.setSelectedParticipant(localParticipant)}
        />
        {sortedParticipants.map(participant => (
          <Participant
            key={participant.sid}
            isDominantSpeaker={participant.identity === dominantIdentity}
            participant={participant}
            isSelected={selectedParticipant === participant}
            userIsSilenced={!!isSilenced}
            onClick={() => participantStore.setSelectedParticipant(participant)}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
});

export default ParticipantStripCollaboration;
