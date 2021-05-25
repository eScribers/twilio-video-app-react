import React from 'react';
import { Pin } from '@primer/octicons-react';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function PinIcon() {
  return (
    <div style={{ position: 'absolute', right: '0px', bottom: '0px' }}>
      <Tooltip title="Participant is pinned. Click to un-pin." placement="top">
        <SvgIcon style={{ fontSize: '29px' }}>
          <Pin />
        </SvgIcon>
      </Tooltip>
    </div>
  );
}
