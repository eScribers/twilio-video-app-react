import React, { useState, useRef } from 'react';
import AboutDialog from '../AboutDialog/AboutDialog';
import IconButton from '@material-ui/core/IconButton';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import MuteNonModerators from '../MuteNonModerators/MuteNonModerators';

export default function Menu() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={anchorRef}>
      <IconButton color="inherit" onClick={() => setMenuOpen(state => !state)}>
        <MoreIcon />
      </IconButton>
      <MenuContainer open={menuOpen} onClose={() => setMenuOpen(state => !state)} anchorEl={anchorRef.current}>
        <MenuItem onClick={() => setAboutOpen(true)}>About</MenuItem>
        <MenuItem onClick={() => setSettingsOpen(true)}>Settings</MenuItem>
        <MuteNonModerators onClick={() => setMenuOpen(false)} />
        {/* TODO - check if Twilio repository do the same function (handleSignOut) when the end call called  */}
        {/* {user && <MenuItem onClick={handleSignOut}>Logout</MenuItem>} */}
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </div>
  );
}
