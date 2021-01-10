export const ERROR_MESSAGE = {
  INVALID_CREDENTIALS: '. Please make sure you are using the correct credentials.',
  UNSUPPORTED_MESSAGE: 'This browser is not supported. Please change/upgrade your browser.',
  NETWORK_ERROR: 'Network Error',
};

export const NOTIFICATION_MESSAGE = {
  ROOM_NOT_FOUND:
    'Waiting for host to join. Please retry again to join in a few minutes. If you do not manage please contact the Impartial Hearing Office',
  AUTO_RETRYING_TO_JOIN_ROOM: 'Waiting for host to join.',
  ROOM_COMPLETED: 'Conference ended since the host left the call',
  WAITING_FOR_REPORTER: 'Waiting for reporter to join.',
  REPORTER_HAS_JOINED: 'Reporter has joined. Please unmute your microphone.',
  REPORTER_DROPPED_FROM_THE_CALL:
    'All participants have been muted (except you as the hearing officer).  Your reporter will be rejoined to the conference momentarily and all parties will be unmuted',
};
export const PLAYER_STATE = {
  stopped: 'stopped',
};

export const ROOM_STATE = {
  RECONNECTING: 'reconnecting',
  RECONNECTED: 'reconnected',
  DISCONNECTED: 'disconnected',
  CONNECTED: 'connected',
};

export const TRACK_TYPE = {
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  SCREEN: 'screen',
  AUDIO: 'audio',
  VIDEO: 'video',
  DATA: 'data',
};
