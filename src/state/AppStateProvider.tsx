import React, { createContext, useState } from 'react';
import StateContextType from '../types/stateContextType';
export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [isAutoRetryingToJoinRoom, setIsAutoRetryingToJoinRoom] = useState(true);
  const [waitingNotification, setWaitingNotification] = useState(null);

  let contextValue = {
    isAutoRetryingToJoinRoom,
    setIsAutoRetryingToJoinRoom,
    waitingNotification,
    setWaitingNotification,
  };

  return (
    // @ts-expect-error
    <StateContext.Provider value={{ ...contextValue }}>{props.children}</StateContext.Provider>
  );
}
