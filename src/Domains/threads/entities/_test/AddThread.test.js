const AddThread = require('../AddThread')

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Tittle Thread'
    }

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true
    }

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      title: 'Tittle Thread',
      body: 'Body Thread'
    }

    // Action
    const addThread = new AddThread(payload)

    // Assert
    expect(addThread).toBeInstanceOf(AddThread)
    expect(addThread.title).toEqual(payload.title)
    expect(addThread.body).toEqual(payload.body)
  })
})
