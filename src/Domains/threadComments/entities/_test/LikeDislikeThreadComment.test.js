const LikeDislikeThreadComment = require('../LikeDislikeThreadComment')

describe('a LikeDislikeThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new LikeDislikeThreadComment(payload)).toThrowError('LIKEDISLIKE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      userId: true
    }

    // Action and Assert
    expect(() => new LikeDislikeThreadComment(payload)).toThrowError('LIKEDISLIKE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create likeDislikeComment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'thread_comment-1',
      userId: 'user-1'
    }

    // Action
    const likeDislikeComment = new LikeDislikeThreadComment(payload)

    // Assert
    expect(likeDislikeComment).toBeInstanceOf(LikeDislikeThreadComment)
    expect(likeDislikeComment.commentId).toEqual(payload.commentId)
    expect(likeDislikeComment.userId).toEqual(payload.userId)
  })
})
