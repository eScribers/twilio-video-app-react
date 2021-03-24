import React from 'react';
import AboutDialog from './AboutDialog';
import { render } from '@testing-library/react';
import { useAppState } from '../../../state';

jest.mock('twilio-video', () => ({ version: '1.2', isSupported: true }));
jest.mock('../../../../package.json', () => ({ version: '1.3' }));
jest.mock('../../../state');

const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ activeSinkId: '' }));
describe('the AboutDialog component', () => {
  it('should display Video.isSupported', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('Browser supported: true')).toBeTruthy();
  });

  it('should display the SDK version', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('SDK Version: 1.2')).toBeTruthy();
  });

  it('should display the package.json version', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('App Version: 1.3')).toBeTruthy();
  });
});
