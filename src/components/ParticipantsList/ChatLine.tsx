import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatLine: {
      height: '80px',
      width: '100%',
      borderBottom: '1px solid #444444',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        background: '#777777',
      },
    },
    iconWrapper: {
      borderRadius: '50%',
      padding: '10px',
      background: '#eeeeee',
      margin: '0 15px',
      height: '60px',
      width: '60px',
    },
    icon: {
      height: '40px',
      width: '40px',
    },
  })
);

const ChatLine = ({ me, participants }) => {
  const classes = useStyles();
  const iconSrc =
    participants.length > 2 || participants[0] === 'All' ? '/assets/icons/users.svg' : '/assets/icons/user.svg';

  return (
    <div className={classes.chatLine}>
      <div className={classes.iconWrapper}>
        <img src={iconSrc} className={classes.icon} />
      </div>
      <div>{participants.filter((v: string) => v !== me).join(', ')}</div>
    </div>
  );
};

ChatLine.defaultProps = {
  me: '',
};

export default ChatLine;
