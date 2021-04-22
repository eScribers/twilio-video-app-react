import React from 'react';
import ParticipantStripCollaboration from '../ParticipantStrip/ParticipantStripCollaboration/ParticipantStripCollaboration';
import ParticipantStripGrid from '../ParticipantStrip/ParticipantStripGrid/ParticipantStripGrid';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { useAppState } from '../../hooks/useAppState/useAppState';

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

export default function Room() {
  const { settings } = useAppState();

  if (settings.viewMode.includes('grid')) {
    return <ParticipantStripGrid viewMode={settings.viewMode} />;
  }

  return (
    <Container>
      <ParticipantStripCollaboration />
      <MainParticipant />
    </Container>
  );
}
