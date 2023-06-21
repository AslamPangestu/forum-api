const DeleteThreadComment = require('../DeleteThreadComment')

describe('a DeleteThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      threadId: true
    }

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'thread_comment-1',
      threadId: 'thread-1'
    }

    // Action
    const addComment = new DeleteThreadComment(payload)

    // Assert
    expect(addComment).toBeInstanceOf(DeleteThreadComment)
    expect(addComment.commentId).toEqual(payload.commentId)
    expect(addComment.threadId).toEqual(payload.threadId)
  })
})
