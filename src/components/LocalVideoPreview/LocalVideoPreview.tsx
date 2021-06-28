import React from 'react';
import AvatarIcon from '../../icons/AvatarIcon';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import LocalAudioLevelIndicator from '../MenuBar/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import rootStore from '../../stores';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
    overflow: 'hidden',
    height: `calc(100vh - 64px)`,
    background: 'black',
  },
  innerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    maxHeight: '100vh',
    display: 'flex',
  },
  identityContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '0.18em 0.3em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    paddingRight: '30px',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'black',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      '& svg': {
        transform: 'scale(0.7)',
      },
    },
  },
}));

const LocalVideoPreview = observer(({ identity }: { identity: string }) => {
  const classes = useStyles();

  const videoTrack = rootStore.participantStore.localTracks.find(track =>
    track?.name.includes('camera')
  ) as LocalVideoTrack;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        {videoTrack ? (
          <VideoTrack track={videoTrack} isLocal />
        ) : (
          <div className={classes.avatarContainer}>
            <AvatarIcon />
          </div>
        )}
      </div>

      <div className={classes.identityContainer}>
        <span className={classes.identity}>
          <LocalAudioLevelIndicator />
          <Typography variant="body1" color="inherit" component="span">
            {identity}
          </Typography>
        </span>
      </div>
    </div>
  );
});

export default LocalVideoPreview;
