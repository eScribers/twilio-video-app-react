import React from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { useAppState } from '../../state';
import { VIEW_MODE } from '../../state/settings/settingsReducer';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '70%',
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

  if (settings.viewMode === VIEW_MODE.grid) {
    return <ParticipantStrip viewMode={settings.viewMode} />;
  }

  return (
    <Container>
      <ParticipantStrip viewMode={settings.viewMode} />
      <MainParticipant />
    </Container>
  );
}
