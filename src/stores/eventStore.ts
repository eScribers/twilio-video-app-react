import { makeAutoObservable } from 'mobx';
import { IEvent } from '../components/EventFeed/Event/types';
import SyncClient from 'twilio-sync';
import rootStore from './makeStore';
import axios from 'axios';

class EventStore {
  rootStore: any;

  events: IEvent[] = [];

  client?: SyncClient;

  constructor(rootStore: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async post(path: string, data: object = {}) {
    const participantAuthToken = this.rootStore.participantsStore.userToken;
    if (!participantAuthToken.length) throw new Error('No auth token is available');
    const url = `${this.rootStore.roomsStore.config.endPoint}/${path}`;

    try {
      const result = await axios({
        url: url,
        method: 'post',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data,
      });
      const { data: res } = result;
      return res;
    } catch (err) {
      throw new Error(`Failed to POST to ${url}: ${err.message}`);
    }
  }

  async connectSync(token: string) {
    const roomSid = this.rootStore.participantsStore.participantInformation?.caseReference;
    if (!roomSid) return console.log('No room sid, cannot connect to Sync');

    if (!token) throw new Error('No participant auth token, cannot connect to Sync');

    // Obtain a JWT access token: https://www.twilio.com/docs/sync/identity-and-access-tokens
    const syncClient = new SyncClient(token);

    syncClient.on('connectionStateChanged', state => {
      if (state === 'connected') {
        this.setSyncClient(syncClient);
      } else if (state === 'connecting') {
        console.log('Unhandled sync event - connecting');
      } else if (state === 'disconnecting') {
        console.log('Unhandled sync event - disconnecting');
      } else if (state === 'denied') {
        console.log('Unhandled sync event - denied');
        this.rootStore.roomsStore.setError('Failed to connect to Sync: Access denied');
      } else if (state === 'error') {
        this.rootStore.roomsStore.setError('Failed to connect to Sync');
      } else if (state === 'disconnected') {
        this.setSyncClient();
      } else {
        throw new Error(`Unhandeled connection status: ${state}`);
      }
    });

    syncClient.on('tokenAboutToExpire', function() {
      rootStore.eventStore.connectSync(token);
    });

    syncClient.on('tokenExpired', function() {
      rootStore.eventStore.connectSync(token);
    });
  }

  setSyncClient = (syncClient?: SyncClient) => {
    this.client = syncClient;
    this.registerSyncListeners();
  };

  async sendMessage(message: string) {
    const identity = this.rootStore.participantsStore.localParticipant?.participant?.identity;

    if (!identity) throw new Error('No participant detected');
    if (message.length === 0) return;

    await this.post('send-message', { message });
  }

  setEvents(events: IEvent[]) {
    this.events = events;
  }

  async registerSyncListeners() {
    if (!this.client) return;
    try {
      const list = await this.client.list(this.rootStore.participantsStore.participantInformation.syncListSid);

      // Get the events initially
      const { items } = await list.getItems({});
      this.setEvents(items.map(item => item.data) as IEvent[]);

      // Listen to updates on the Document
      list.on('itemAdded', function(event) {
        const { data } = event.item.descriptor;
        rootStore.eventStore.setEvents([...rootStore.eventStore.events, data]);
      });
    } catch (err) {
      console.error('Unexpected error', err);
    }
  }
}

export default EventStore;
