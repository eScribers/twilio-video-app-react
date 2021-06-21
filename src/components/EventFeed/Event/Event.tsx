import React from 'react';
import moment from 'moment';
import { EventTypes, IEvent } from './types';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: '7px 5px',
      background: '#444444',
      padding: '2px 5px',
      borderRadius: '5px',
      alignSelf: 'flex-end',
      maxWidth: '90%',
    },
    me: {
      background: '#006bb3',
      alignSelf: 'flex-start',
      maxWidth: '90%',
    },
    user: {
      fontSize: '0.9em',
    },
    messageText: {
      padding: '3px 5px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    time: {
      fontSize: '10px',
      marginLeft: '10px',
      alignSelf: 'flex-end',
    },
    event: {
      background: '#666666',
      textAlign: 'center',
      width: '90%',
      margin: '5px',
      borderRadius: '5px',
      alignSelf: 'center',
      display: 'grid',
      gridTemplateColumns: '40px 1fr 40px',
      padding: '2px 9px',
    },
  })
);

const Event = ({ type, time, data, myIdentity }: IEvent & { myIdentity: string }) => {
  const classes = useStyles();

  if (type === EventTypes.message) {
    return (
      <div className={`${classes.message} ${myIdentity === data.user ? classes.me : ''}`}>
        <b className={classes.user}>{data.user}</b>
        <div className={classes.messageText}>
          {data.text}
          <i className={classes.time}>{moment(time).format('HH:mm')}</i>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.event}>
      <i />
      <div className={classes.messageText}>
        {data.user ? `${data.user} ` : ''}
        {data.text}
      </div>
      <i className={classes.time}>{moment(time).format('HH:mm')}</i>
    </div>
  );
};

export default Event;