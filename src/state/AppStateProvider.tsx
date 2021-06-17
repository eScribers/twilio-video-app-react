import React, { createContext, useState } from 'react';
import StateContextType from '../types/stateContextType';
export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [isAutoRetryingToJoinRoom, setIsAutoRetryingToJoinRoom] = useState(true);
  const [waitingNotification, setWaitingNotification] = useState(null);
  const [activeSinkId, setActiveSinkId] = useState('default');
  const [selectedAudioInput, setSelectedAudioInput] = useState({ deviceId: '' });
  const [selectedVideoInput, setSelectedVideoInput] = useState({ deviceId: '' });
  const [selectedSpeakerOutput, setSelectedSpeakerOutput] = useState({ deviceId: '' });
  const [isSilenced, setIsSilenced] = useState<boolean>(false);

  let contextValue = {
    isAutoRetryingToJoinRoom,
    setIsAutoRetryingToJoinRoom,
    waitingNotification,
    setWaitingNotification,
    selectedAudioInput,
    setSelectedAudioInput,
    selectedVideoInput,
    setSelectedVideoInput,
    selectedSpeakerOutput,
    setSelectedSpeakerOutput,
    activeSinkId,
    setActiveSinkId,
    isSilenced,
    setIsSilenced,
  };

  return (
    // @ts-expect-error
    <StateContext.Provider value={{ ...contextValue }}>{props.children}</StateContext.Provider>
  );
}
