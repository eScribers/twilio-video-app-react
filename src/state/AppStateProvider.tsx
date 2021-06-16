import React, { createContext, useState } from 'react';
import { TwilioError } from 'twilio-video';
import { NOTIFICATION_MESSAGE } from '../utils/displayStrings';
import axios from 'axios';
import { ROLE_PERMISSIONS } from '../utils/rbac/rolePermissions';
import * as jwt_decode from 'jwt-decode';
import roleChecker from '../utils/rbac/roleChecker';
import useConfig from '../hooks/useConfig/useConfig';
import { INotification } from '../types';
import { ParticipantInformation } from '../types/participantInformation';
import StateContextType from '../types/stateContextType';
import rootStore from '../stores';
import moment, { Moment } from 'moment';

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const { roomStore } = rootStore;
  const { settings } = roomStore;
  const [error, setError] = useState<TwilioError | null>(null);
  const [notification, setNotification] = useState<INotification | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasTriedAuthorisation, setHasTriedAuthorisation] = useState(false);
  const [isAutoRetryingToJoinRoom, setIsAutoRetryingToJoinRoom] = useState(true);
  const [waitingNotification, setWaitingNotification] = useState(null);
  const [, setUser] = useState(null);
  const [activeSinkId, setActiveSinkId] = useState('default');
  const [userToken, setUserToken] = useState('');
  const [selectedAudioInput, setSelectedAudioInput] = useState({ deviceId: '' });
  const [selectedVideoInput, setSelectedVideoInput] = useState({ deviceId: '' });
  const [selectedSpeakerOutput, setSelectedSpeakerOutput] = useState({ deviceId: '' });
  const [participantInfo, setParticipantInfo] = useState(null);
  const [joinTime, setJoinTime] = useState<Moment | null>(null);
  const [isSilenced, setIsSilenced] = useState<boolean>(false);
  const { endPoint, environmentName, domainName, loaded: isConfigLoaded } = useConfig({ setError });

  const participantAuthToken = window.location.hash.substr(1);
  const query = new URLSearchParams(window.location.search);
  const returnUrl = query.get('returnUrl');

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
    activeSinkId,
    setActiveSinkId,
    settings,
    isConfigLoaded,
    isSilenced,
    setIsSilenced,
    authoriseParticipant: async () => {
      const url = `${endPoint}/authorise-participant`;
      console.log('attempting authorise ' + new Date().toLocaleTimeString());

      try {
        const { data } = await axios({
          url: url,
          method: 'POST',
          headers: {
            Authorization: participantAuthToken ? `Bearer ${participantAuthToken}` : '',
          },
        });

        return data;
      } catch (err) {
        setError({ message: 'Could not authorize participant; ' + err } as TwilioError);
      }

      return false;
    },
    participantInfo,
    getToken: async (participantInformation: ParticipantInformation) => {
      if (!isConfigLoaded) return null;

      const url = `${endPoint}/token`;
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
    disconnectParticipant: async (isRegistered?: boolean) => {
      if (!isConfigLoaded) return null;

      if (joinTime && moment().isSameOrAfter(joinTime.add(3, 'hours').add(50, 'minutes'))) {
        return window.location.reload();
      }

      const decodedRedirectTabulaUrl = atob(returnUrl ? returnUrl : '');
      const loginPageUrl = `http://tabula-${environmentName}.${domainName}/tabula/welcome/thankyou`;

      if (isRegistered) window.location.replace(decodedRedirectTabulaUrl);
      else window.location.replace(loginPageUrl);
    },
    removeParticipant: async participantSid => {
      if (!isConfigLoaded) return null;
      const url = `${endPoint}/remove-participant`;

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
    setHasTriedAuthorisation(true);

    try {
      const response: any = await contextValue.authoriseParticipant();
      if (!response) return response;
      setParticipantInfo(response.participantInfo);
      return response.participantInfo;
    } catch (err) {
      setError({ message: 'error authorising participant: ' + err } as TwilioError);
      return Promise.reject(err);
    }
  };

  const getToken: StateContextType['getToken'] = async (participantInformation: ParticipantInformation) => {
    setJoinTime(moment());
    setIsFetching(true);

    const res: any = await contextValue.getToken(participantInformation);
    try {
      setIsFetching(false);

      if (
        !res.roomExist &&
        !roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, participantInformation.partyType)
      )
        return NOTIFICATION_MESSAGE.ROOM_NOT_FOUND;

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
