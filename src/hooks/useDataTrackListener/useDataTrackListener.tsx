import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect } from 'react';
import { RemoteParticipant } from 'twilio-video';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import { TRACK_TYPE } from '../../utils/displayStrings';
import roleChecker from '../../utils/rbac/roleChecker';
import { ROLE_PERMISSIONS } from '../../utils/rbac/rolePermissions';
import { IMuteRemoteParticipantMessage } from '../../utils/muteRemoteParticipantMessage';

export default function useDataTrackListener() {
  const { room, localTracks } = useVideoContext();

  useEffect(() => {
    const handleRemoteParticipant = (participant: RemoteParticipant) => {
      if (
        roleChecker.doesRoleHavePermission(
          ROLE_PERMISSIONS.START_ROOM,
          ParticipantIdentity.Parse(participant.identity).partyType
        )
      ) {
        participant.on('trackSubscribed', track => {
          console.log(`Participant "${participant.identity}" added ${track.kind} Track ${track.sid}`);
          if (track.kind === 'data') {
            track.on('message', messageData => {
              console.log('message recieved ' + messageData);
              handleMessage(messageData);
            });
          }
        });
      }
    };

    function handleMessage(messageData: any) {
      console.log(`received message on data tack: ${messageData}`);

      var muteRemoteParticipantMessage = JSON.parse(messageData) as IMuteRemoteParticipantMessage;
      if (muteRemoteParticipantMessage.participantSid === room.localParticipant.sid) {
        console.log(
          `Received mute participant message for this participant (${room.localParticipant.sid}). Disabling/Muting local audio track`
        );
        const audioTrack = localTracks.find(x => x.kind === TRACK_TYPE.AUDIO);
        audioTrack?.disable();
      }
    }

    //for existing participants at time when this local participant joins
    if (room !== undefined && room.participants !== undefined) {
      room.participants.forEach(handleRemoteParticipant);
    }

    //for participants who join after this local participant joins
    room.on('participantConnected', handleRemoteParticipant);
    return () => {
      room.off('participantConnected', handleRemoteParticipant);
    };
  }, [room, localTracks]);
}
