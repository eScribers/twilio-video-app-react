import useVideoContext from '../useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { Participant } from 'twilio-video';
import { useAppState } from '../../state';
import { IMuteRemoteParticipantMessage } from 'utils/muteRemoteParticipantMessage';

export interface IParticipantCommands {
  muteParticipant: (participantToMute: Participant) => void;
  removeParticipant: (participantToRemove: Participant) => void;
}

export default function useParticipant(): IParticipantCommands {
  const videoContext = useVideoContext();
  const { setError, removeParticipant } = useAppState();

  function muteParticipant(participantToMute: Participant) {
    let localModeratorDataTrack = Array.from(videoContext.room.localParticipant.dataTracks.values()).filter(
      dataTrack => dataTrack.kind === TRACK_TYPE.DATA
    );
    if (localModeratorDataTrack && localModeratorDataTrack.length >= 1) {
      var muteRemoteParticipantMessage = {} as IMuteRemoteParticipantMessage;
      muteRemoteParticipantMessage.action = 'mute';
      muteRemoteParticipantMessage.participantSid = participantToMute.sid;

      localModeratorDataTrack[0].track.send(JSON.stringify(muteRemoteParticipantMessage));
    }
  }

  //Note: function is called removeOtherParticipant to avoid ambiguity on the name of the removeParticipant in useAppState
  function removeOtherParticipant(participantToRemove: Participant) {
    removeParticipant(participantToRemove.sid).catch(err => {
      setError({ message: err.response.data });
    });
  }

  return { muteParticipant, removeParticipant: removeOtherParticipant };
}
