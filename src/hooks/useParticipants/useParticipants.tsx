import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import UAParser from 'ua-parser-js';
import { Howl } from 'howler';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';

// Free to use sounds:
//https://freesound.org/people/FoolBoyMedia/sounds/352656/
const logInSound = new Howl({
  src: ['assets/sounds/logIn.mp3'],
});
//https://freesound.org/people/FoolBoyMedia/sounds/352656/
const logOutSound = new Howl({
  src: ['assets/sounds/logOut.mp3'],
});

export default function useParticipants() {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState(Array.from(room.participants?.values() || []));

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker) {
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker]);

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();

    const participantConnected = (participant: RemoteParticipant) => {
      if (result.os.name !== 'iOS') logInSound.play();
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant: RemoteParticipant) => {
      if (result.os.name !== 'iOS') logOutSound.play();
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
