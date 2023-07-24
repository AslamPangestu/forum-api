const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError')

const IUserRepository = require('../../../../Domains/users/IUserRepository')
const IThreadCommentRepository = require('../../../../Domains/threadComments/IThreadCommentRepository')
const DeleteThreadComment = require('../../../../Domains/threadComments/entities/DeleteThreadComment')

const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase')

describe('DeleteThreadCommentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1',
      commentId: 'thread_comment-1'
    }
    const user = {
      id: 'user-1',
      username: 'dicoding'
    }

    /** creating dependency of use case */
    const mockThreadCommentRepository = new IThreadCommentRepository()
    const mockUserRepository = new IUserRepository()

    /** mocking needed function */
    mockThreadCommentRepository.checkThreadCommentAllow = jest.fn(() => Promise.resolve({ user_id: user.id }))
    mockThreadCommentRepository.deleteThreadComment = jest.fn(() => Promise.resolve())

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
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
    expect(mockThreadCommentRepository.checkThreadCommentAllow).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId
    })
    expect(mockThreadCommentRepository.deleteThreadComment).toHaveBeenCalledWith(new DeleteThreadComment({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId
    }), user.id)
  })

  it('should orchestrating the delete thread comment action incorrectly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1',
      commentId: 'thread_comment-1'
    }
    const user = {
      id: 'user-1',
      username: 'dicoding'
    }

    /** creating dependency of use case */
    const mockThreadCommentRepository = new IThreadCommentRepository()
    const mockUserRepository = new IUserRepository()

    /** mocking needed function */
    mockThreadCommentRepository.checkThreadCommentAllow = jest.fn(() => Promise.resolve({ user_id: 'user-2' }))
    mockThreadCommentRepository.deleteThreadComment = jest.fn(() => Promise.resolve())

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
      id: user.id,
      username: user.username
    }))

    /** creating use case instance */
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      userRepository: mockUserRepository
    })

    // Action
    // const service = await deleteThreadCommentUseCase.execute(useCasePayload, user.id)

    // Assert
    await expect(deleteThreadCommentUseCase.execute(useCasePayload, user.id)).rejects.toThrow(AuthorizationError)
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-1')
    expect(mockThreadCommentRepository.checkThreadCommentAllow).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId
    })
  })
})
