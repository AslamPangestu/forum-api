const AddThreadComment = require('../AddThreadComment')

describe('a AddThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: true
    }

    // Action and Assert
    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment 1',
      threadId: 'thread-1'
    }

    // Action
    const addComment = new AddThreadComment(payload)

    // Assert
    expect(addComment).toBeInstanceOf(AddThreadComment)
    expect(addComment.content).toEqual(payload.content)
    expect(addComment.threadId).toEqual(payload.threadId)
  })
})
