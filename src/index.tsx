import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Video from 'twilio-video';
import UAParser from 'ua-parser-js';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ERROR_MESSAGE } from './utils/displayStrings';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { VideoProvider } from './components/VideoProvider/';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import NotificationDialog from './components/NotificationDialog/NotificationDialog';
import theme from './theme';
import App from './App';
import WaitingForRoomDialog from 'components/WaitingForRoomDialog/WaitingForRoomDialog';
import { observer } from 'mobx-react-lite';
import rootStore from './stores';
import { INotification } from './types';

const alertProviderOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 10000,
  offset: '30px',
  transition: transitions.SCALE,
};

const VideoApp = () => {
  const { roomsStore } = rootStore;
  const { notifications } = roomsStore;

  // useEffect(() => {
  //   logger.push({
  //     logglyKey: process.env.REACT_APP_LOGGLY_CUSTOMER_TOKEN,
  //     sendConsoleErrors: true,
  //     tag: process.env.REACT_APP_LOGGLY_TAG,
  //   });
  //   logger.push({
  //     vendor: navigator.vendor,
  //     browserType: detectBrowser(),
  //     userAgent: navigator.userAgent,
  //   });
  // }, []);

  if (!Video.isSupported) {
    // Please follow the following git issue and remove the following code if chrome on iOS is supported
    // https://github.com/twilio/twilio-video.js/issues/1388
    // <<<<<< START
    const parser = new UAParser();
    const result = parser.getResult();
    let allowAnyway = false;
    const osVer = result.os.version.split('.');

    // forcing "allow" to iOS version 14.4 (for chrome/firefox)
    if (result.os.name === 'iOS' && Number(osVer[0] || 0) >= 14 && Number(osVer[1] || 0) >= 4) allowAnyway = true;

    if (!allowAnyway)
      // END >>>>>>>
      return (
        <ErrorDialog
          dismissError={() => null}
          error={{ type: 'error', message: ERROR_MESSAGE.UNSUPPORTED_MESSAGE as string } as INotification}
        />
      );
  }
  return (
    <VideoProvider>
      {!notifications.length || notifications[0]?.type !== 'error' ? null : (
        <ErrorDialog dismissError={() => roomsStore.dismissNotfication(notifications[0])} error={notifications[0]} />
      )}
      {!notifications.length || notifications[0]?.type !== 'notification' ? null : (
        <NotificationDialog
          dismissNotification={() => roomsStore.dismissNotfication(notifications[0])}
          notification={notifications[0]}
        />
      )}
      <WaitingForRoomDialog />
      <App />
    </VideoProvider>
  );
};

const VideoAppObserved = observer(VideoApp);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />

    <Router>
      <Switch>
        <Route exact path="/">
          <AlertProvider template={AlertTemplate} {...alertProviderOptions}>
            <VideoAppObserved />
          </AlertProvider>
        </Route>
      </Switch>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
