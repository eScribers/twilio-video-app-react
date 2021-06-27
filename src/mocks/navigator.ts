const mockGetUserMedia = jest.fn(async () => {
  return new Promise<void>(resolve => {
    resolve();
  });
});

const mockEnumerateDevices = jest.fn(
  () =>
    new Promise((res, _rej) => {
      res([]);
    })
);

// @ts-expect-error
if (!global.definedMediaDevicesForJest) {
  // @ts-expect-error
  global.definedMediaDevicesForJest = true;
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      enumerateDevices: mockEnumerateDevices,
      getUserMedia: mockGetUserMedia,
      addEventListener: jest.fn(),
      getDisplayMedia: () => {},
    },
    configurable: true,
  });
}

export {};
