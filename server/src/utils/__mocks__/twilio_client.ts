export const twilioClient = {
  video: {
    rooms: jest.fn().mockImplementation(() => ({
      update: jest.fn()
    }))
  }
}