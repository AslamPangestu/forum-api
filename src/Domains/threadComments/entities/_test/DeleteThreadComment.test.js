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

  it('should create deleteComment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'thread_comment-1',
      threadId: 'thread-1'
    }

    // Action
    const deleteComment = new DeleteThreadComment(payload)

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteThreadComment)
    expect(deleteComment.commentId).toEqual(payload.commentId)
    expect(deleteComment.threadId).toEqual(payload.threadId)
    expect(deleteComment.replyId).toBeNull()
  })

  it('should create deleteComment object correctly when does have reply', () => {
    // Arrange
    const payload = {
      commentId: 'thread_comment-2',
      threadId: 'thread-1',
      replyId: 'thread_comment-1'
    }

    // Action
    const deleteComment = new DeleteThreadComment(payload)

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteThreadComment)
    expect(deleteComment.commentId).toEqual(payload.commentId)
    expect(deleteComment.threadId).toEqual(payload.threadId)
    expect(deleteComment.replyId).toEqual(payload.replyId)
  })
})
