const GetThread = require('../GetThread')

describe('GetThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        date: '2023-06-04T13:29:54.057Z'
      }
    ]

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: true,
        title: 1,
        body: 21,
        date: '2023-06-04T13:29:54.057Z',
        comment_id: {},
        username: []
      }
    ]

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create GetThread entities correctly', () => {
    // Arrange
    // TODO: Implement List Comments with Replies
    const payload = [
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        date: '2023-06-04T13:29:54.057Z',
        comment_id: 'comment-1',
        content: 'comment 1',
        username: 'dicoding'
      }
    ]

    // Action
    const thread = new GetThread(payload)

    // Assert
    expect(thread).toBeInstanceOf(GetThread)
    expect(thread.id).toEqual(payload[0].id)
    expect(thread.title).toEqual(payload[0].title)
    expect(thread.body).toEqual(payload[0].body)
    expect(thread.date).toEqual(payload[0].date)
    expect(thread.username).toEqual(payload[0].username)
    // TODO: Implement List Comments with Replies
  })
})
