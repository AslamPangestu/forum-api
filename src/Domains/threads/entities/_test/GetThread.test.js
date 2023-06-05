const GetThread = require('../GetThread')

describe('GetThread entities', () => {
  it('should throw error when payload not an array or when array is empty', () => {
    // Arrange
    const payloadNotArray = {}
    const payloadArrayEmpty = []

    // Action & Assert
    expect(() => new GetThread(payloadNotArray)).toThrowError('THREAD.NOT_FOUND')
    expect(() => new GetThread(payloadArrayEmpty)).toThrowError('THREAD.NOT_FOUND')
  })

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-1',
        title: 'abc',
        created_at: '2023-06-04T13:29:54.057Z'
      }
    ]

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: true,
        title: 1,
        body: 21,
        created_at: '2023-06-04T13:29:54.057Z',
        user_id: 'user-1',
        username: 'Username 1'
      }
    ]

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create GetThread entities correctly', () => {
    // Arrange
    // TODO: Implement List Comments with Replies
    const payload = [
      {
        id: 'thread-1',
        title: 'abc',
        body: 'abc',
        created_at: '2023-06-04T13:29:54.057Z',
        user_id: 'user-1',
        username: 'Username 1'
      }
    ]

    // Action
    const thread = new GetThread(payload)

    // Assert
    expect(thread).toBeInstanceOf(GetThread)
    expect(thread.id).toEqual(payload[0].id)
    expect(thread.title).toEqual(payload[0].title)
    expect(thread.body).toEqual(payload[0].body)
    expect(thread.date).toEqual(payload[0].created_at)
    expect(thread.username).toEqual(payload[0].user.username)
    // TODO: Implement List Comments with Replies
  })
})
