import React, { useState } from 'react';
import { Button } from '@material-ui/core';

interface IMessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput = ({ sendMessage }: IMessageInputProps) => {
  const [message, setMessage] = useState('');

  const submitMessage = (e: any) => {
    e.preventDefault();
    if (!message.length) return;
    sendMessage(message);
    setMessage('');
    return false;
  };

  return (
    <form onSubmit={submitMessage}>
      <input id="chatInput" type="text" onChange={e => setMessage(e.target.value)} value={message} />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageInput;
