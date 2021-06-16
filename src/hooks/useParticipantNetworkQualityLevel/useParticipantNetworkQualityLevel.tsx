import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';

export default function useParticipantNetworkQualityLevel(participant: Participant) {
  const [networkQualityLevel, setNetworkQualityLevel] = useState(participant?.networkQualityLevel);

  useEffect(() => {
    const handleNewtorkQualityLevelChange = (newNetworkQualityLevel: number) => {
      console.log('Handling networkQualityLevel change', newNetworkQualityLevel);

      setNetworkQualityLevel(newNetworkQualityLevel);
    };
    // THIS IS CURRENTLY BROKEN:
    console.log('THIS IS CURRENTLY BROKEN: Setting quality monitory', participant, participant?.networkQualityLevel);

    setNetworkQualityLevel(participant?.networkQualityLevel);
    participant.on('networkQualityLevelChanged', handleNewtorkQualityLevelChange);
    return () => {
      participant.off('networkQualityLevelChanged', handleNewtorkQualityLevelChange);
    };
  }, [participant]);

  return networkQualityLevel;
}
