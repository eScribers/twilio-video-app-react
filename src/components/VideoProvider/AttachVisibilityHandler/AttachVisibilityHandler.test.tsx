import React from 'react';
import AttachVisibilityHandler from './AttachVisibilityHandler';
import { render } from '@testing-library/react';
import * as utils from '../../../utils';
import rootStore from '../../../stores';

jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => ({ room: {} }));

const mockToggleVideoEnabled = jest.fn();

Object.defineProperty(document, 'visibilityState', { value: '', writable: true });

describe('the AttachVisibilityHandler component', () => {
  describe('when isMobile is false', () => {
    it('should not add a visibilitychange event handler to the document', () => {
      // @ts-ignore
      utils.isMobile = false;
      jest.spyOn(document, 'addEventListener');
      render(<AttachVisibilityHandler />);
      expect(document.addEventListener).not.toHaveBeenCalledWith('visibilitychange');
    });
  });

  describe('when isMobile is true', () => {
    beforeAll(() => {
      // @ts-ignore
      utils.isMobile = true;
    });

    beforeEach(jest.clearAllMocks);

    it('should add a visibilitychange event handler to the document', () => {
      jest.spyOn(document, 'addEventListener');
      render(<AttachVisibilityHandler />);
      expect(document.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });

    it('should correctly toggle video when it is already enabled', () => {
      jest.spyOn(rootStore.participantsStore, 'toggleVideoEnabled');
      render(<AttachVisibilityHandler />);

      // @ts-ignore
      document.visibilityState = 'hidden';
      document.dispatchEvent(new Event('visibilitychange'));
      expect(rootStore.participantsStore.toggleVideoEnabled).toHaveBeenCalled();

      jest.clearAllMocks();

      // @ts-ignore
      document.visibilityState = 'visible';
      document.dispatchEvent(new Event('visibilitychange'));
      expect(rootStore.participantsStore.toggleVideoEnabled).toHaveBeenCalled();
    });

    it('should correctly toggle video when it is already disabled', () => {
      render(<AttachVisibilityHandler />);

      // @ts-ignore
      document.visibilityState = 'hidden';
      document.dispatchEvent(new Event('visibilitychange'));
      expect(mockToggleVideoEnabled).not.toHaveBeenCalled();

      jest.clearAllMocks();

      // @ts-ignore
      document.visibilityState = 'visible';
      document.dispatchEvent(new Event('visibilitychange'));
      expect(mockToggleVideoEnabled).not.toHaveBeenCalled();
    });
  });
});
