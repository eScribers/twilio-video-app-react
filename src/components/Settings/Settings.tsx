import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const Settings = () => {
  const classes = useStyles();

  return <div>Settings</div>;
};

export default Settings;
