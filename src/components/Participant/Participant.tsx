import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isDominantSpeaker?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  userIsSilenced?: boolean;
}

export default function Participant({
  participant,
  videoOnly,
  enableScreenShare,
  onClick,
  isSelected,
  isLocalParticipant,
  hideParticipant,
  isDominantSpeaker,
  userIsSilenced,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
      isDominantSpeaker={isDominantSpeaker}
    >
      <ParticipantTracks
        participant={participant}
        videoOnly={videoOnly || userIsSilenced}
        enableScreenShare={enableScreenShare}
        isLocalParticipant={isLocalParticipant}
      />
    </ParticipantInfo>
  );
}
