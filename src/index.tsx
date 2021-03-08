import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Video, { TwilioError } from 'twilio-video';
import UAParser from 'ua-parser-js';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ERROR_MESSAGE } from './utils/displayStrings';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import AppStateProvider, { useAppState } from './state';
import { VideoProvider } from './components/VideoProvider/';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import NotificationDialog from './components/NotificationDialog/NotificationDialog';
import theme from './theme';
import App from './App';
import { detectBrowser } from './utils/index';
import { LogglyTracker } from 'react-native-loggly-jslogger';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import WaitingForRoomDialog from 'components/WaitingForRoomDialog/WaitingForRoomDialog';

const alertProviderOptions = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 10000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const logger: LogglyTracker = new LogglyTracker();
const VideoApp = () => {
  const {
    error,
    setError,
    notification,
    setNotification,
    disconnectParticipant,
    setIsAutoRetryingToJoinRoom,
    setWaitingNotification,
    waitingNotification,
  } = useAppState();
  const connectionOptions = useConnectionOptions();
  useEffect(() => {
    logger.push({
      logglyKey: process.env.REACT_APP_LOGGLY_CUSTOMER_TOKEN,
      sendConsoleErrors: true,
      tag: process.env.REACT_APP_LOGGLY_TAG,
    });
    logger.push({
      vendor: navigator.vendor,
      browserType: detectBrowser(),
      userAgent: navigator.userAgent,
    });
  }, []);

  if (!Video.isSupported) {
    // Please follow the following git issue and remove the following code if chrome on iOS is supported
    // https://github.com/twilio/twilio-video.js/issues/1388
    // <<<<<< START
    const parser = new UAParser();
    const result = parser.getResult();
    let allowAnyway = false;
    const osVer = result.os.version.split('.');

    // forcing "allow" to iOS version 14.4 (for chrome/firefox)
    if (result.os.name === 'iOS' && Number(osVer[0] || 0) >= 14 && Number(osVer[1] || 0) >= 5) allowAnyway = true;

    if (!allowAnyway)
      // END >>>>>>>
      return (
        <ErrorDialog
          dismissError={() => null}
          error={{ message: ERROR_MESSAGE.UNSUPPORTED_MESSAGE as string } as TwilioError}
        />
      );
  }
  return (
    <VideoProvider
      options={connectionOptions}
      onError={setError}
      onNotification={setNotification}
      onDisconnect={disconnectParticipant}
    >
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <NotificationDialog dismissNotification={() => setNotification(null)} notification={notification} />
      <WaitingForRoomDialog
        cancelWait={() => {
          setIsAutoRetryingToJoinRoom(false);
          setWaitingNotification(null);
        }}
        waitingNotification={waitingNotification}
      />
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />

    <Router>
      <AppStateProvider>
        <Switch>
          <Route exact path="/">
            <AlertProvider template={AlertTemplate} {...alertProviderOptions}>
              <VideoApp />
            </AlertProvider>
          </Route>
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
