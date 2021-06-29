import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Event from './Event/Event';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    EventFeedWrapper: {
      display: 'grid',
      gridTemplateRows: '1fr 60px',
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

const EventFeed = () => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const { eventStore } = rootStore;

  const { events } = eventStore;

  useEffect(() => {
    document.querySelector('.pin-to-bottom')?.scrollTo({ top: 1000000 });
  }, [events]);

  const submitMessage = e => {
    e.preventDefault();
    (async () => {
      eventStore.sendMessage(message);
      setMessage('');
    })();
  };

  return (
    <div className={classes.EventFeedWrapper}>
      <div className={`${classes.feed} pin-to-bottom`}>
        {events.map((event, key) => (
          <Event {...event} key={key} />
        ))}
      </div>
      <form className={classes.inputWrapper} onSubmit={submitMessage}>
        <input className={classes.input} value={message} onChange={e => setMessage(e.target.value)} />
        <button className={classes.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default observer(EventFeed);
