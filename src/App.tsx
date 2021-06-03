import React from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';
import { ROOM_STATE } from './utils/displayStrings';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import MessageText from './components/MessageText/MessageText';
import MessagingSection from './components/MessagingSection/MessagingSection';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflowX: 'hidden',
});

const query = new URLSearchParams(window.location.search);
const returnUrl = query.get('returnUrl');

export default function App() {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  if (!returnUrl) {
    // return <MessagingSection />;
    return <div>No conference data was included. Please check the URL is correct.</div>;
  }

  return (
    <Container style={{ height }}>
      <MessageText />
      <MenuBar />
      <Main>
        {roomState === ROOM_STATE.DISCONNECTED ? <LocalVideoPreview identity="You" /> : <Room />}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
