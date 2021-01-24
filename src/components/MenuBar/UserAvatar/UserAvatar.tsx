import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/styles/makeStyles';
import Person from '@material-ui/icons/Person';
import { StateContextType } from '../../../state';

const useStyles = makeStyles({
  red: {
    color: 'white',
    backgroundColor: '#F22F46',
  },
});

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(text => text[0])
    .join('')
    .toUpperCase();
}
//{ user }: { user: StateContextType['user'] }
export default function UserAvatar() {
  const classes = useStyles();
  const { displayName, photoURL } = { displayName: '', photoURL: '' };

  return photoURL ? (
    <Avatar src={photoURL} />
  ) : (
    <Avatar className={classes.red}>{displayName ? getInitials(displayName) : <Person />}</Avatar>
  );
}
