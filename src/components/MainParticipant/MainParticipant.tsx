import React from 'react';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';
import { Track } from 'twilio-video';

const MainParticipant = () => {
  const { participantsStore } = rootStore;
  const { mainParticipant, participant: localParticipant } = participantsStore;

  let videoPriority = mainParticipant !== participantsStore.localParticipant?.participant?.identity ? 'high' : null;

  if (mainParticipant === localParticipant?.identity) {
    videoPriority = 'high';
  }

  if (!mainParticipant && typeof mainParticipant === 'string') return null;

  const participant = [participantsStore.localParticipant?.participant, ...participantsStore.participants].find(
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
