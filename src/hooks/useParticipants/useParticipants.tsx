import { useEffect } from 'react';
import { RemoteParticipant } from 'twilio-video';
import UAParser from 'ua-parser-js';
import { Howl } from 'howler';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';
import rootStore from '../../stores';

// Free to use sounds:
//https://freesound.org/people/FoolBoyMedia/sounds/352656/
const logInSound = new Howl({
  src: ['assets/sounds/logIn.mp3'],
});
//https://freesound.org/people/FoolBoyMedia/sounds/352656/
const logOutSound = new Howl({
  src: ['assets/sounds/logOut.mp3'],
});

let listenersAreSet = false;

export default function useParticipants() {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const { participantStore } = rootStore;

  const existingParticipants = Array.from(room.participants?.values() || []);

  if (participantStore.participants.length === 0 && existingParticipants.length >= 1) {
    participantStore.setParticipants(existingParticipants);
  }

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker) {
      const updatedParticipants = [
        dominantSpeaker,
        ...participantStore.participants.filter(participant => participant !== dominantSpeaker),
      ];
      participantStore.setParticipants(updatedParticipants);
    }
  }, [dominantSpeaker, participantStore]);

  useEffect(() => {
    if (listenersAreSet) return;
    listenersAreSet = true;
    const parser = new UAParser();
    const result = parser.getResult();

    const participantConnected = (participant: RemoteParticipant) => {
      if (result.os.name !== 'iOS') logInSound.play();
      participantStore.addParticipant(participant);
    };
    const participantDisconnected = (participant: RemoteParticipant) => {
      if (result.os.name !== 'iOS') logOutSound.play();
      participantStore.removeParticipantSid(participant.sid);
    };
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room, participantStore]);

  return participantStore.participants;
}
