export enum EventTypes {
  message = 'Message',
  file = 'File',
  event = 'Event',
}

export interface IEventData {
  text: string;
  user?: string;
  affectsUser?: string;
}

export interface IEvent {
  type: EventTypes;
  time: Date;
  data: IEventData;
}

export interface IEventFeed {
  events?: IEvent[];
}
