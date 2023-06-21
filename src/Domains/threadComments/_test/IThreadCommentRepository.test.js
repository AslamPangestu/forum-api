const IThreadCommentRepository = require('../IThreadCommentRepository')

describe('IThreadCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new IThreadCommentRepository()

    // Action and Assert
    await expect(threadCommentRepository.addThreadComment({}, '')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.deleteThreadComment('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
