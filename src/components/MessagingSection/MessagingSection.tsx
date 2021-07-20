import React, { useState } from 'react';
import EventFeed from '../EventFeed/EventFeed';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ParticipantsList from '../ParticipantsList/ParticipantsList';
import Settings from '../Settings/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideMenu: {
      display: 'grid',
      gridTemplateRows: '40px minmax(0, 1fr)',
      height: '100vh',
      width: '400px',
      backgroundColor: 'gray',
    },
    tabs: {
      backgroundColor: '#303030',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: '40px',
    },
    tab: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: '.2s ease-out all',
      '&:hover': {
        boxShadow: 'inset 0 0 3px #000000',
      },
    },
    tabSelected: {
      background: '#555555',
      boxShadow: 'inset 0 0 6px #222222',
      transition: '.1s ease-out all',
      '&:hover': {
        boxShadow: 'inset 0 0 8px #222222',
      },
    },
  })
);

const Tab = ({ name, children, tab: currentTab, setTab, classes }) => (
  <div className={`${classes.tab} ${name === currentTab ? classes.tabSelected : ''}`} onClick={() => setTab(name)}>
    {children}
  </div>
);

const MessagingSection = () => {
  const classes = useStyles();
  const [tab, setTab] = useState('participantList');

  return (
    <div className={classes.sideMenu}>
      <div className={classes.tabs}>
        <Tab {...{ tab, setTab, classes }} name="participantList">
          Participants
        </Tab>
        <Tab {...{ tab, setTab, classes }} name="eventFeed">
          Chat
        </Tab>
        <Tab {...{ tab, setTab, classes }} name="settings">
          Settings
        </Tab>
      </div>
      {tab === 'participantList' && <ParticipantsList />}
      {tab === 'eventFeed' && <EventFeed />}
      {tab === 'settings' && <Settings />}
    </div>
  );
};

export default MessagingSection;
