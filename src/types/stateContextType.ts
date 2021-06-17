export default interface StateContextType {
  isAutoRetryingToJoinRoom: boolean;
  setIsAutoRetryingToJoinRoom(isAutoRetrying: boolean): void;
  waitingNotification: string;
  setWaitingNotification(waitingNotification: string | null): void;
  setSelectedAudioInput: string;
  selectedVideoInput: string;
  setSelectedVideoInput: string;
  selectedSpeakerOutput: string;
  setSelectedSpeakerOutput: string;
  activeSinkId?: string | undefined;
  setActiveSinkId(sinkId: string): void;
  isSilenced: boolean;
  setIsSilenced: React.Dispatch<React.SetStateAction<boolean>>;
}
