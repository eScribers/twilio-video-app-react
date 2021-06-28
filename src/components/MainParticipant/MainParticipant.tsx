import React from 'react';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';
import { Track } from 'twilio-video';

const MainParticipant = () => {
  const { participantStore } = rootStore;
  const { mainParticipant, participant: localParticipant } = participantStore;

  let videoPriority = mainParticipant !== participantStore.participant?.identity ? 'high' : null;

  if (mainParticipant === localParticipant?.identity) {
    videoPriority = 'high';
  }

  if (!mainParticipant && typeof mainParticipant === 'string') return null;

  const participant = [participantStore.participant, ...participantStore.participants].find(
    p => p?.identity === mainParticipant
  );
  if (!participant) return null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={participant}>
      <ParticipantTracks
        participant={participant}
        videoOnly
        enableScreenShare={mainParticipant !== localParticipant?.identity}
        videoPriority={videoPriority as Track.Priority}
        isLocalParticipant={mainParticipant === localParticipant?.identity}
      />
    </MainParticipantInfo>
  );
};

export default observer(MainParticipant);
