import React from 'react';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';

const MainParticipant = observer(() => {
  const mainParticipant = useMainParticipant();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const { selectedParticipant } = rootStore.participantStore;
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    (mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? 'high'
      : null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        videoOnly
        enableScreenShare={mainParticipant !== localParticipant}
        videoPriority={videoPriority}
        isLocalParticipant={mainParticipant === localParticipant}
      />
    </MainParticipantInfo>
  );
});

export default MainParticipant;
