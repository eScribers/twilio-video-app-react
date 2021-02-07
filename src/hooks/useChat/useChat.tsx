import { useEffect, useState } from 'react';
import SyncClient, { SyncDocument } from 'twilio-sync';
import { set, get } from 'lodash';

export interface IMessage {
  id: string;
  message: string;
}

export interface IChatRoom {
  participants: string[];
  messages: IMessage[] | [];
}

export interface IChatRooms {
  rooms: {
    [key: string]: IChatRoom;
  };
}

const initial_room: IChatRoom = { participants: [], messages: [] };
const initial_rooms: IChatRooms = { rooms: { global: initial_room } };

export default function useChat(roomName: string, accessToken: string, identity: string) {
  const [syncClient, setSyncClient] = useState<SyncClient | null>(null);
  const [chats, setChats] = useState<IChatRooms>(initial_rooms);
  const [chat, setChat] = useState<IChatRoom>(initial_room);
  const [document, setDocument] = useState<SyncDocument | null>(null);
  const [groupChat, setGroupChat] = useState<string>('global');

  const sendMessage = (message: string) => {
    if (!document) return;

    let newValue = { ...chats };
    const newMessage: IMessage = { id: identity, message };
    const existingMessages = get(newValue, ['rooms', groupChat, 'messages']) || [];
    newValue = set(newValue, ['rooms', groupChat, 'messages'], [...existingMessages, newMessage]);
    const weekInSeconds = 7 * 24 * 3600;

    return document
      .set(newValue, { ttl: weekInSeconds })
      .then(function(updateResult) {
        console.log('Message sent', updateResult);
      })
      .catch(e => {
        console.log('Error while submitting message', e);
      });
  };

  useEffect(() => {
    console.log({ accessToken });
    setSyncClient(new SyncClient(accessToken, { logLevel: 'debug' }));
  }, [accessToken]);

  useEffect(() => {
    console.log(1, { accessToken });

    if (!syncClient) return;

    syncClient
      // .document(roomName)
      .document('roomName')
      .then(function(document) {
        console.log('test');
        // Listen to updates on the Document
        document.on('updated', e => setChats(e.value));
        setDocument(document);
        const getChats: IChatRooms | any = document.data;
        setChats(getChats);
      })
      .catch(e => console.error('Unexpected error', e));
  }, [syncClient, roomName]);

  useEffect(() => {
    let getChat: IChatRoom = chats?.rooms?.[groupChat];
    if (!getChat) getChat = initial_room;
    setChat(getChat);
  }, [chats, groupChat]);

  const relevantGroups: string[] = Object.keys(chats.rooms || []).filter(v => v.split(',').includes(identity));

  return { chat, sendMessage, groupChat, setGroupChat, relevantGroups };
}
