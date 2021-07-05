import React from 'react';
import ParticipantStripCollaboration from '../ParticipantStrip/ParticipantStripCollaboration/ParticipantStripCollaboration';
import ParticipantGrid from '../ParticipantStrip/ParticipantGrid/ParticipantGrid';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { observer } from 'mobx-react-lite';
import rootStore from '../../stores';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 'calc(100vh - 70px)',
  display: 'grid',
  gridTemplateColumns: `${theme.sidebarWidth}px 1fr`,
  gridTemplateAreas: '". participantList"',
  gridTemplateRows: '100%',
  [theme.breakpoints.down('xs')]: {
    gridTemplateAreas: '"participantList" "."',
    gridTemplateColumns: `auto`,
    gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
    gridGap: '6px',
  },
}));

const Room = () => {
  const { roomsStore } = rootStore;
  const { settings } = roomsStore;

  if (settings.viewMode.includes('grid')) {
    return <ParticipantGrid viewMode={settings.viewMode} />;
  }

  return (
    <Container>
      <ParticipantStripCollaboration />
      <MainParticipant />
    </Container>
  );
};

export default observer(Room);
