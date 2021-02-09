import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useChat from '../../hooks/useChat/useChat';
import ChatContent from './ChatContent/ChatContent';
import MessageInput from './MessageInput/MessageInput';
import ChatGroups from './ChatGroups/ChatGroups';

const useStyles = makeStyles((theme: Theme) => ({
  chat_container: {
    position: 'fixed',
    top: '150px',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
    maxHeight: '600px',
    background: 'rgba(255,255,255,0.3)',
    padding: '5px',
    transition: '.3s ease-out all',
    backdropFilter: 'blur(5px)',
    borderRadius: '0px 5px 5px 0px',
    '&:hover, &:focus': {
      background: 'rgba(100,100,100,0.8)',
    },
  },
}));

function Chat() {
  const classes = useStyles();
  const { room, accessToken } = useVideoContext();
  const { chat, sendMessage, groupChat, setGroupChat, relevantGroups } = useChat(
    room.name,
    accessToken,
    room.localParticipant.identity
  );

  return (
    <div className={classes.chat_container}>
      <h3>{groupChat || room.name} Chat!</h3>
      <ChatContent chat={chat} me={room.localParticipant} />
      <MessageInput sendMessage={sendMessage} />
      <ChatGroups groupChat={groupChat} setGroupChat={setGroupChat} relevantGroups={relevantGroups} />
    </div>
  );
}

export default Chat;
