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
      comment_id: 123,
      thread_id: true
    }

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      comment_id: 'thread_comment-1',
      thread_id: 'thread-1'
    }

    // Action
    const addComment = new DeleteThreadComment(payload)

    // Assert
    expect(addComment).toBeInstanceOf(DeleteThreadComment)
    expect(addComment.comment_id).toEqual(payload.comment_id)
    expect(addComment.thread_id).toEqual(payload.thread_id)
  })
})
