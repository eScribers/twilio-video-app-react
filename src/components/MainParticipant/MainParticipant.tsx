import React from 'react';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';

const MainParticipant = observer(() => {
  const { participantStore } = rootStore;
  const { mainParticipant, participant } = participantStore;
  const { selectedParticipant } = rootStore.participantStore;
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    (mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant) &&
    mainParticipant.identity !== participantStore.participant?.identity
      ? 'high'
      : null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        videoOnly
        enableScreenShare={mainParticipant !== participant}
        videoPriority={videoPriority}
        isLocalParticipant={mainParticipant === participant}
      />
    </MainParticipantInfo>
  );
});

export default MainParticipant;
