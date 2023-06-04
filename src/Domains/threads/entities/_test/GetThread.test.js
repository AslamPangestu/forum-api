const GetThread = require('../GetThread')

describe('GetThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 12345
    }

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create GetThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding'
    }

    // Action
    const getThread = new GetThread(payload)

    // Assert
    expect(getThread).toBeInstanceOf(GetThread)
    expect(getThread.id).toEqual(payload.id)
  })
})
