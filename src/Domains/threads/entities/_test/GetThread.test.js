const GetThread = require('../GetThread')

describe('GetThread entities', () => {
  it('should throw error when payload not array', () => {
    // Arrange
    const payload = ''

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_AN_ARRAY')
  })

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        created_at: '2023-06-04T13:29:54.057Z'
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
        created_at: '2023-06-04T13:29:54.057Z',
        comment_id: {},
        username: []
      }
    ]

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create GetThread entities correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        created_at: '2023-06-04T13:29:54.057Z',
        username: 'dicoding',
        comment_id: null,
        comment_content: null,
        comment_at: null,
        comment_username: null
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
    expect(thread.username).toEqual(payload[0].username)
    expect(thread.comments).toBeInstanceOf(Array)
    expect(thread.comments).toHaveLength(0)
  })

  it('should create GetThread with comment entities correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        created_at: '2023-06-04T13:29:54.057Z',
        username: 'dicoding',
        comment_id: null,
        comment_content: null,
        comment_at: null,
        comment_username: null,
        reply_id: null
      },
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        created_at: '2023-06-04T13:29:54.057Z',
        username: 'dicoding',
        comment_id: 'thread_comment-1',
        comment_content: 'comment 1',
        comment_at: '2023-06-04T13:29:54.057Z',
        comment_username: 'dicoding',
        reply_id: null
      },
      {
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        created_at: '2023-06-04T13:29:54.057Z',
        username: 'dicoding',
        comment_id: 'thread_comment-2',
        comment_content: 'comment 1',
        comment_at: '2023-06-04T13:29:54.057Z',
        comment_username: 'dicoding',
        reply_id: 'thread_comment-1'
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
    expect(thread.username).toEqual(payload[0].username)
    expect(thread.comments).toBeInstanceOf(Array)
    expect(thread.comments).toHaveLength(1)

    const comment = thread.comments[0]
    expect(comment.id).toEqual(payload[1].comment_id)
    expect(comment.username).toEqual(payload[1].comment_username)
    expect(comment.date).toEqual(payload[1].comment_at)
    expect(comment.content).toEqual(payload[1].comment_content)
    expect(comment.replies).toBeInstanceOf(Array)
    expect(comment.replies).toHaveLength(1)


    const reply = comment.replies[0]
    expect(reply.id).toEqual(payload[2].comment_id)
    expect(reply.username).toEqual(payload[2].comment_username)
    expect(reply.date).toEqual(payload[2].comment_at)
    expect(reply.content).toEqual(payload[2].comment_content)
  })
})
