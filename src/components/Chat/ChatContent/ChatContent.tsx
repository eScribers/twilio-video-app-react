import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { IMessage } from '../../../hooks/useChat/useChat';
import { IChatRoom } from '../../../hooks/useChat/useChat';

const useStyles = makeStyles((theme: Theme) => ({
  chat_content: {
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    maxHeight: '250px',
    overflowY: 'auto',
    width: '100%',
  },
}));

interface IChatContentProps {
  chat: IChatRoom;
}

const ChatContent = ({ chat }: IChatContentProps) => {
  const classes = useStyles();
  return (
    <div className={classes.chat_content} id="chatContent">
      {(chat.messages as IMessage[]).map((v: IMessage, k: number) => (
        <React.Fragment key={k}>
          <div>{v.id}:</div>
          <div>{v.message}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ChatContent;
