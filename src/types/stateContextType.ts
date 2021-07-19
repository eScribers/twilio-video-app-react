export default interface StateContextType {
  isAutoRetryingToJoinRoom: boolean;
  setIsAutoRetryingToJoinRoom(isAutoRetrying: boolean): void;
  waitingNotification: string;
  setWaitingNotification(waitingNotification: string | null): void;
}
