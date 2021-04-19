import { useEffect } from 'react';
import { useAppState } from '../../state';

const MessageText = ({ defaultMessage = '' }) => {
  const { setNotification } = useAppState();

  const query = new URLSearchParams(window.location.search);
  // defaultMessage is used in the jest testing only
  const messageText = query.get('messageText') || defaultMessage;

  useEffect(() => {
    if (messageText.length >= 1) setNotification({ message: messageText });
  }, [messageText, setNotification]);

  return null;
};

export default MessageText;
