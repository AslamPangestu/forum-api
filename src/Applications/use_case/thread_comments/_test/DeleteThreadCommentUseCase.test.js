const DeleteThreadComment = require('../../../../Domains/threadComments/entities/DeleteThreadComment')
const IThreadCommentRepository = require('../../../../Domains/threadComments/IThreadCommentRepository')
const IUserRepository = require('../../../../Domains/users/IUserRepository')
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase')

describe('DeleteThreadCommentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread_id: 'thread-1',
      comment_id: 'thread_comment-1'
    }
    const user = {
      id: 'user-1',
      username: 'dicoding'
    }

    /** creating dependency of use case */
    const mockThreadCommentRepository = new IThreadCommentRepository()
    const mockUserRepository = new IUserRepository()

    /** mocking needed function */
    mockThreadCommentRepository.deleteThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: user.id,
        username: user.username
      }))

    /** creating use case instance */
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      userRepository: mockUserRepository
    })

    // Action
    await deleteThreadCommentUseCase.execute(useCasePayload, user.id)

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-1')
    expect(mockThreadCommentRepository.deleteThreadComment).toHaveBeenCalledWith(new DeleteThreadComment({
      comment_id: useCasePayload.comment_id,
      thread_id: useCasePayload.thread_id
    }), user.id)
  })
})
