import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@material-ui/core';
import useParticipants from '../../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { xor } from 'lodash';
import ParticipantNameTag from 'components/ParticipantInfo/ParticipantNameTag/ParticipantNameTag';

interface IChatGroupsProps {
  groupChat: string;
  setGroupChat: Dispatch<SetStateAction<string>>;
  relevantGroups: string[];
}

const ChatGroups = ({ groupChat, setGroupChat, relevantGroups }: IChatGroupsProps) => {
  const participants = useParticipants();
  const [markedParticipants, setMarkedParticipants] = useState<string[]>([]);
  const { room } = useVideoContext();

  const getRoomName = (parties: string[]) => {
    if (parties.length) {
      return [...parties, room.localParticipant.identity].sort().join(',');
    }
    return room.name;
  };

  const createRoom = () => {
    if (!markedParticipants.length) return;
    setGroupChat(getRoomName(markedParticipants));
    setMarkedParticipants([]);
  };

  const markParticipant = (id: string) => {
    setMarkedParticipants(xor([...markedParticipants], [id]));
  };

  return (
    <div id="chatGroups">
      {groupChat !== 'global' ? (
        <Button onClick={() => setGroupChat('global')}>Return to global chat</Button>
      ) : (
        <>
          {!participants.length ? null : <h3>Select participants for group chat</h3>}
          {participants.map((participant, k) => {
            return (
              <Button
                key={k}
                className={`participant_${k}`}
                onClick={() => markParticipant(participant.identity)}
                color={markedParticipants.includes(participant.identity) ? 'primary' : undefined}
                variant={markedParticipants.includes(participant.identity) ? 'contained' : undefined}
              >
                <ParticipantNameTag participant={participant} />
              </Button>
            );
          })}
          {!markedParticipants.length ? null : (
            <Button color="primary" onClick={createRoom} id="createRoom">
              Create group
            </Button>
          )}
          {!relevantGroups.length ? null : <h3>My groups</h3>}
          {relevantGroups.map((groupName, k) => (
            <Button key={k} onClick={() => setGroupChat(groupName)}>
              {groupName}
            </Button>
          ))}
        </>
      )}
    </div>
  );
};

export default ChatGroups;
