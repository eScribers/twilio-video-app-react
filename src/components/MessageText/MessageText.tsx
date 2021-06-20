import { useEffect } from 'react';
import { Base64 } from 'js-base64';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';

interface IMessageText {
  defaultMessage?: string;
}

const MessageText = observer(({ defaultMessage = '' }: IMessageText) => {
  const { roomStore } = rootStore;

  const query = new URLSearchParams(window.location.search);
  // defaultMessage is used in the jest testing only
  const messageText = query.get('messageText') || defaultMessage;

  useEffect(() => {
    if (messageText.length >= 1) roomStore.setNotification({ message: Base64.decode(messageText) });
  }, [messageText, roomStore]);

  return null;
});

export default MessageText;
