import { useEffect } from 'react';
import { Base64 } from 'js-base64';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';

interface IMessageText {
  defaultMessage?: string;
}

const MessageText = observer(({ defaultMessage = '' }: IMessageText) => {
  const { roomStore } = rootStore;
  const { setNotification } = roomStore;

  const query = new URLSearchParams(window.location.search);
  // defaultMessage is used in the jest testing only
  const messageText = query.get('messageText') || defaultMessage;

  useEffect(() => {
    if (messageText.length >= 1) setNotification({ message: Base64.decode(messageText) });
  }, [messageText, setNotification]);

  return null;
});

export default MessageText;
