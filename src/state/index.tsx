import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { TwilioError } from 'twilio-video';
import { NOTIFICATION_MESSAGE } from '../utils/displayStrings';
import axios from 'axios';

import * as jwt_decode from 'jwt-decode';
import isModerator from '../utils/rbac/roleChecker';

export interface ParticipantInformation {
  caseReference: string;
  displayName: string;
  partyType: string;
  userId: number | null;
  videoConferenceRoomName: string;
}

export interface StateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  notification: string | null;
  setNotification(notification: string | null): void;
  isAutoRetryingToJoinRoom: boolean;
  setIsAutoRetryingToJoinRoom(isAutoRetrying: boolean): void;
  waitingNotification: string;
  setWaitingNotification(waitingNotification: string | null): void;
  isFetching: boolean;
  setSelectedAudioInput: string;
  selectedVideoInput: string;
  setSelectedVideoInput: string;
  selectedSpeakerOutput: string;
  setSelectedSpeakerOutput: string;
  gridView: boolean;
  setGridView: any;
  authoriseParticipant(): Promise<any>;
  participantInfo: ParticipantInformation;
  getToken(participantInformation: ParticipantInformation): Promise<string>;
  removeParticipant: any;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [notification, setNotification] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasTriedAuthorisation, setHasTriedAuthorisation] = useState(false);
  const [isAutoRetryingToJoinRoom, setIsAutoRetryingToJoinRoom] = useState(true);
  const [waitingNotification, setWaitingNotification] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [gridView, setGridView] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [selectedAudioInput, setSelectedAudioInput] = useState({ deviceId: '' });
  const [selectedVideoInput, setSelectedVideoInput] = useState({ deviceId: '' });
  const [selectedSpeakerOutput, setSelectedSpeakerOutput] = useState({ deviceId: '' });
  const [participantInfo, setParticipantInfo] = useState(null);

  const participantAuthToken = window.location.hash.substr(1);

  //const [endpoint, setEndpoint] = useState('');
  var endpoint = '';

  // fetch(`${process.env.PUBLIC_URL}/config.json`)
  //   .then(r => r.json())
  //   .then(data => {
  //     //setEndpoint(data.endPoint);
  //     endpoint = data.endPoint;
  //   });

  async function fetchEndpoint(endpointUrl) {
    if (endpointUrl !== '') return;

    console.log(
      `fetching endpoint. process.env: ${
        process.env ? 'process.env: ' + JSON.stringify(process.env) : 'not yet initialised'
      }`
    );
    console.log(
      `fetching endpoint. process.env.PUBLIC_URL: ${
        process.env.PUBLIC_URL
          ? 'process.env.PUBLIC_URL: ' + JSON.stringify(process.env.PUBLIC_URL)
          : 'not yet initialised'
      }`
    );

    await fetch(`${process.env.PUBLIC_URL}/config.json`)
      .then(
        response => {
          console.log('response from fetch received');
          return response.json();
        },
        err => {
          console.log('failed to fetch url. err: ' + err);
        }
      )
      .then(responseBodyAsJson => {
        console.log('response body from fetch: ' + JSON.stringify(responseBodyAsJson));
        //setEndpoint(responseBodyAsJson.endPoint);
        endpoint = responseBodyAsJson.endPoint;
      });
  }

  async function ensureEndpointInitialised() {
    if (endpoint === '') {
      console.log('ensureEndpointInitialised. endpoint not yet defined attempting to fetch now');
      await fetchEndpoint(endpoint);
      if (endpoint === '') {
        //throw new Error('endpoint still not defined.');
        console.log('warning: endpoint not defined');
        return false;
      } else {
        console.log('managed to fetch endpoint: ' + endpoint);
        return true;
      }
    } else return true;
  }

  let contextValue = ({
    error,
    setError,
    notification,
    setNotification,
    isAutoRetryingToJoinRoom,
    setIsAutoRetryingToJoinRoom,
    waitingNotification,
    setWaitingNotification,
    isFetching,
    selectedAudioInput,
    setSelectedAudioInput,
    selectedVideoInput,
    setSelectedVideoInput,
    selectedSpeakerOutput,
    setSelectedSpeakerOutput,
    gridView,
    setGridView,
    authoriseParticipant: async () => {
      if (!(await ensureEndpointInitialised())) return null;

      const url = `${endpoint}/authorise-participant`;

      console.log('attempting authorise ' + new Date().toLocaleTimeString());

      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data: {},
      });

      return data;
    },
    participantInfo,
    getToken: async (participantInformation: ParticipantInformation) => {
      const endpointIsInitialised = await ensureEndpointInitialised();
      if (!endpointIsInitialised) return null;

      const url = `${endpoint}/token`;
      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
        },
        data: {
          caseReference: participantInformation.caseReference,
          partyName: participantInformation.displayName,
          partyType: participantInformation.partyType,
          userId: participantInformation.userId,
          videoConferenceRoomName: participantInformation.videoConferenceRoomName,
        },
      });

      return data;
    },
    removeParticipant: async participantSid => {
      if (!(await ensureEndpointInitialised())) return null;
      const url = `${endpoint}/remove-participant`;

      const { data } = await axios({
        url: url,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: { participantSid },
      });

      return data;
    },
  } as unknown) as StateContextType;

  const authoriseParticipant: StateContextType['authoriseParticipant'] = async () => {
    if (hasTriedAuthorisation) return participantInfo;

    //setIsFetching(true);

    try {
      const response: any = await contextValue.authoriseParticipant();
      //setIsFetching(false);
      if (!response) return response;
      setParticipantInfo(response.participantInfo);
      setHasTriedAuthorisation(true);
      return response.participantInfo;
    } catch (err) {
      //setHasTriedAuthorisation(true);
      //setError({ message: 'Unauthorised Access', code: 401, name: 'Authorization Error' });
      //setIsFetching(false);
      console.log('error authorising participant: ' + err);

      return Promise.reject(err);
    }
  };

  const getToken: StateContextType['getToken'] = async (participantInformation: ParticipantInformation) => {
    setIsFetching(true);

    const res: any = await contextValue.getToken(participantInformation);
    try {
      setIsFetching(false);

      if (!res.roomExist && !isModerator(participantInformation.partyType)) return NOTIFICATION_MESSAGE.ROOM_NOT_FOUND;

      setUserToken(res.result);
      const user = jwt_decode(res.result);
      setUser(user);

      return user.twilioToken;
    } catch (err) {
      setIsFetching(false);
      console.log('error occured on getToken: ' + JSON.stringify(err));
      return '';
    }
  };
  const removeParticipant: StateContextType['removeParticipant'] = participantSid => {
    return contextValue.removeParticipant(participantSid).catch(err => {
      return Promise.reject(err);
    });
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken, removeParticipant, authoriseParticipant }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState(): any {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
