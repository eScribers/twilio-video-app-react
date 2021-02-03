import React, { useCallback, useState } from 'react';
import {
  DialogContent,
  FormControl,
  Grid,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { inputLabels, Settings } from '../../../state/settings/settingsReducer';
import { RenderDimensions } from '../../../state/settings/renderDimensions';
import { useAppState } from '../../../state';
import useRoomState from '../../../hooks/useRoomState/useRoomState';

const useStyles = makeStyles({
  formControl: {
    display: 'block',
    margin: '1.5em 0',
    '&:first-child': {
      margin: '0 0 1.5em 0',
    },
  },
  label: {
    width: '133%', // Labels have scale(0.75) applied to them, so this effectively makes the width 100%
  },
});

const withDefault = (val?: string) => (typeof val === 'undefined' ? 'default' : val);

const RenderDimensionItems = RenderDimensions.map(({ label, value }) => (
  <MenuItem value={value} key={value}>
    {label}
  </MenuItem>
));

export default function ConnectionOptions({ className, hidden }: { className?: string; hidden?: boolean }) {
  const classes = useStyles();
  const { settings, dispatchSetting } = useAppState();
  const roomState = useRoomState();
  const isDisabled = roomState !== 'disconnected';

  const handleChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown; name?: string }>) => {
      dispatchSetting({ name: e.target.name as keyof Settings, value: e.target.value as string });
    },
    [dispatchSetting]
  );
  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown; name?: string }>) => {
      if (!/[^\d]/.test(e.target.value as string)) handleChange(e);
    },
    [handleChange]
  );
  const [showAdvanceSettingMode, setShowAdvanceSettingMode] = useState(false);
  return (
    <DialogContent className={className} hidden={hidden}>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id={inputLabels.viewMode}>Mode:</InputLabel>
            <Select
              fullWidth
              name={inputLabels.viewMode}
              label={inputLabels.viewMode}
              value={withDefault(settings.viewMode)}
              onChange={handleChange}
            >
              <MenuItem value="grid 2X2">2 Column</MenuItem>
              <MenuItem value="grid 3X3">3 Column</MenuItem>
              <MenuItem value="grid 4X4">4 Column</MenuItem>
              <MenuItem value="collaboration">Collaboration</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={
                <Checkbox
                  id="showAdvanceSetting"
                  checked={showAdvanceSettingMode}
                  onChange={e => {
                    setShowAdvanceSettingMode(e.target.checked);
                  }}
                />
              }
              label="Show Advance Setting"
            />
          </FormControl>
        </Grid>
      </Grid>
      <div id="advanceSettingGrid" hidden={!showAdvanceSettingMode}>
        <Grid item xs={12}>
          <Typography variant="body2">Bandwidth Profile Settings:</Typography>
          <Typography hidden={!isDisabled} variant="body2">
            These settings cannot be changed when connected to a room.
          </Typography>
        </Grid>
        <Grid id={inputLabels.dominantSpeakerPriority} item sm={6} xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id={inputLabels.dominantSpeakerPriority}>Dominant Speaker Priority:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={inputLabels.dominantSpeakerPriority}
              label={inputLabels.dominantSpeakerPriority}
              value={withDefault(settings.dominantSpeakerPriority)}
              onChange={handleChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="default">Server Default</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id={inputLabels.trackSwitchOffMode}>Track Switch Off Mode:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={inputLabels.trackSwitchOffMode}
              label={inputLabels.trackSwitchOffMode}
              value={withDefault(settings.trackSwitchOffMode)}
              onChange={handleChange}
            >
              <MenuItem value="predicted">Predicted</MenuItem>
              <MenuItem value="detected">Detected</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
              <MenuItem value="default">Server Default</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              disabled={isDisabled}
              fullWidth
              id={inputLabels.maxTracks}
              label="Max Tracks"
              placeholder="Leave blank for no limit"
              name={inputLabels.maxTracks}
              value={withDefault(settings.maxTracks)}
              onChange={handleNumberChange}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              disabled={isDisabled}
              fullWidth
              id={inputLabels.maxAudioBitrate}
              label="Max Audio Bitrate"
              placeholder="Leave blank for no limit"
              name={inputLabels.maxAudioBitrate}
              value={withDefault(settings.maxAudioBitrate)}
              onChange={handleNumberChange}
            />
          </FormControl>
        </Grid>
        <Grid id={inputLabels.renderDimensionLow} item sm={6} xs={12}>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel id={inputLabels.renderDimensionLow} className={classes.label}>
              Render Dimension (Low Priority):
            </InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={inputLabels.renderDimensionLow}
              label={inputLabels.renderDimensionLow}
              value={withDefault(settings.renderDimensionLow)}
              onChange={handleChange}
            >
              {RenderDimensionItems}
            </Select>
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <InputLabel id={inputLabels.renderDimensionStandard} className={classes.label}>
              Render Dimension (Standard Priority):
            </InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={inputLabels.renderDimensionStandard}
              label={inputLabels.renderDimensionStandard}
              value={withDefault(settings.renderDimensionStandard)}
              onChange={handleChange}
            >
              {RenderDimensionItems}
            </Select>
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <InputLabel id={inputLabels.renderDimensionHigh} className={classes.label}>
              Render Dimension (High Priority):
            </InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={inputLabels.renderDimensionHigh}
              label={inputLabels.renderDimensionHigh}
              value={withDefault(settings.renderDimensionHigh)}
              onChange={handleChange}
            >
              {RenderDimensionItems}
            </Select>
          </FormControl>
        </Grid>
      </div>
    </DialogContent>
  );
}
