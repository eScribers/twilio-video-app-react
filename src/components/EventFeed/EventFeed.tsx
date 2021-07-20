import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { EventTypes, IEvent, IEventFeed } from './Event/types';
import Event from './Event/Event';

const mockData: IEvent[] = [
  {
    type: EventTypes.message,
    time: new Date(),
    data: {
      text: 'Hi world!',
      user: 'Gal',
    },
  },
  {
    type: EventTypes.message,
    time: new Date(),
    data: {
      text: 'Hi world 2!',
      user: 'Tal',
    },
  },
  {
    type: EventTypes.event,
    time: new Date(),
    data: {
      text: 'went off record',
      user: 'Gal',
    },
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    EventFeedWrapper: {
      display: 'grid',
      gridTemplateRows: '1fr 50px',
      gridTemplateColumns: '100%',
      width: '400px',
    },
    feed: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      overflow: 'auto',
    },
    inputWrapper: {
      display: 'flex',
      justifySelf: 'center',
      width: '90%',
      margin: '10px 5px',
    },
    input: {
      borderRadius: '5px 0 0 5px',
      width: '80%',
      border: 'none',
      height: '30px',
      padding: '2px 5px',
    },
    sendButton: {
      borderRadius: '0 5px 5px 0',
      width: '20%',
      border: 'none',
      height: '30px',
      fontWeight: 700,
      cursor: 'pointer',
    },
  })
);

const EventFeed = ({ events = mockData }: IEventFeed) => {
  const classes = useStyles();
  // const [eventsState, setEventsState] = useState(events);
  const [eventsState] = useState(events);

  useEffect(() => {
    document.querySelector('.pin-to-bottom')?.scrollTo({ top: 1000000 });
    // setTimeout(() =>{
    //   setEventsState([...eventsState, eventsState[eventsState.length - 3]]);
    // }, 2000)
  }, [eventsState]);

  return (
    <div className={classes.EventFeedWrapper}>
      <div className={`${classes.feed} pin-to-bottom`}>
        {eventsState.map((event, key) => (
          <Event {...event} myIdentity="Gal" key={key} />
        ))}
      </div>
      <div className={classes.inputWrapper}>
        <input className={classes.input} />
        <button className={classes.sendButton}>Send</button>
      </div>
    </div>
  );
};

export default EventFeed;
