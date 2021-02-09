import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import { Howl } from 'howler';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';

const logInSound = new Howl({
  src: ['assets/sounds/logIn.mp3'],
});
const logOutSound = new Howl({
  src: ['assets/sounds/logOut.mp3'],
});

export default function useParticipants() {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [useDominantSpeakerEffect] = useState(false);
  const [participants, setParticipants] = useState(Array.from(room.participants.values()));

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.

  useEffect(() => {
    if (dominantSpeaker && useDominantSpeakerEffect) {
      console.log(useDominantSpeakerEffect);
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker, useDominantSpeakerEffect]);

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      logInSound.play();
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant: RemoteParticipant) => {
      logOutSound.play();
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
    };
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return participants;
}
