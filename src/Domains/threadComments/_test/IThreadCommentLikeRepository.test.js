const IThreadCommentLikeRepository = require('../IThreadCommentLikeRepository')

describe('IThreadCommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentLikeRepository = new IThreadCommentLikeRepository()

    // Action and Assert
    await expect(threadCommentLikeRepository.addThreadCommentLike({}, '')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentLikeRepository.updateThreadCommentLike({}, '')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentLikeRepository.findThreadCommentLike({}, '')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
