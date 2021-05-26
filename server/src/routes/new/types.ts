
export interface IUserPermissions {
  startRoom: boolean;
  endRoom: boolean;
  muteParticipants: boolean;
  removeParticipants: boolean;
  chatAccess: boolean;
  chatWriteAccess: boolean;
  chatFileSharingAccess: boolean;
  screenSharingAccess: boolean;
}

export interface IUser {
  id: string;
  displayName: string;
  name: string;
  permissions: IUserPermissions[];
}

export interface IParticipant extends IUser {
  muted: boolean;
  cameraOff: boolean;
  sharingScreen: boolean;
}

export interface IChat {
  messages: (IMessage | IEvent | IFileMessage)[];
}

export interface IMessage {
  text: string;
  senderName: IUser['displayName'];
  senderId: IUser['id'];
  time: Date;
}

export interface IEvent {
  eventText: string;
  time: Date;
}

export interface IFileMessage {
  fileUrl: string;
  fileSize: string;
  senderName: IUser['displayName'];
  senderId: IUser['id'];
  time: Date;
}

export interface IRoomSettings {
  chat: boolean | {
    fileSharing?: boolean;
  };
  screenSharing?: boolean;
}