import React, { createContext, ReactNode } from 'react';
import { ErrorCallback } from '../../types';
import AttachVisibilityHandler from './AttachVisibilityHandler/AttachVisibilityHandler';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useScreenShareToggle from '../../hooks/useScreenShareToggle/useScreenShareToggle';
import { ConnectOptions, Room, TwilioError } from 'twilio-video';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';
/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

export interface IVideoContext {
  room: Room;
  isConnecting: boolean;
  onError: ErrorCallback;
  onDisconnect: (isRegistered?: boolean) => void;
  isSharingScreen: boolean;
  toggleScreenShare: () => void;
}

export const VideoContext = createContext<IVideoContext>(null!);

interface VideoProviderProps {
  options?: ConnectOptions;
  children: ReactNode;
}

export const VideoProvider = observer(({ children }: VideoProviderProps) => {
  const { roomStore } = rootStore;

  const { room, isConnecting } = roomStore;

  const onErrorCallback = (error: TwilioError) => {
    console.log(`ERROR: ${error.message}`, error);
    roomStore.setError(error);
  };
  useHandleTrackPublicationFailed(room, roomStore.setError);
  const [isSharingScreen, toggleScreenShare] = useScreenShareToggle(room, roomStore.setError);

  return (
    <VideoContext.Provider
      value={{
        room,
        isConnecting,
        onError: onErrorCallback,
        onDisconnect: () => {},
        isSharingScreen,
        toggleScreenShare,
      }}
    >
      {children}
      {/* 
        The AttachVisibilityHandler component is using the useLocalVideoToggle hook
        which must be used within the VideoContext Provider.
      */}
      <AttachVisibilityHandler />
    </VideoContext.Provider>
  );
});
