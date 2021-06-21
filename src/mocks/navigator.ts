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

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    enumerateDevices: mockEnumerateDevices,
    getUserMedia: mockGetUserMedia,
    addEventListener: jest.fn(),
  },
});

export {};
