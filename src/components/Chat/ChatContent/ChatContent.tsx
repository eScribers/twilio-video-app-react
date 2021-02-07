import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { IMessage } from '../../../hooks/useChat/useChat';
import { IChatRoom } from '../../../hooks/useChat/useChat';
import { Participant } from 'twilio-video';
import useParticipants from 'hooks/useParticipants/useParticipants';
import ParticipantNameTag from 'components/ParticipantInfo/ParticipantNameTag/ParticipantNameTag';

const useStyles = makeStyles((theme: Theme) => ({
  chat_content: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '250px',
    overflowY: 'auto',
    width: '100%',
  },
}));

interface IChatContentProps {
  chat: IChatRoom;
  me: Participant;
}

const ChatContent = ({ chat, me }: IChatContentProps) => {
  const classes = useStyles();
  const participants = useParticipants();

  const getParticipantByIdentity = (identity: string) => {
    const all = [...(participants || []), me];
    return all.find(v => v.identity === identity) || identity;
  };

  return (
    <div className={classes.chat_content} id="chatContent">
      {(chat.messages as IMessage[]).map((v: IMessage, k: number) => (
        <React.Fragment key={k}>
          <div>
            <ParticipantNameTag participant={getParticipantByIdentity(v.id)} />
          </div>
          <div>{v.message}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ChatContent;
