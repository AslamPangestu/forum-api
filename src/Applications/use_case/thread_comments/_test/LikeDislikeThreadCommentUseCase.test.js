const IUserRepository = require('../../../../Domains/users/IUserRepository')
const IThreadCommentRepository = require('../../../../Domains/threadComments/IThreadCommentRepository')
const IThreadCommentLikeRepository = require('../../../../Domains/threadComments/IThreadCommentLikeRepository')
const LikeDislikeThreadComment = require('../../../../Domains/threadComments/entities/LikeDislikeThreadComment')

const LikeDislikeThreadCommentUseCase = require('../LikeDislikeThreadCommentUseCase')

describe('LikeDislikeThreadCommentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the add thread comment action correctly', async () => {
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
    const mockThreadCommentLikeRepository = new IThreadCommentLikeRepository()

    /** mocking needed function */
    mockThreadCommentLikeRepository.findThreadCommentLike = jest.fn(() => Promise.resolve(null))
    mockThreadCommentLikeRepository.addThreadCommentLike = jest.fn(() => Promise.resolve())

    mockThreadCommentRepository.checkThreadCommentAllow = jest.fn(() => Promise.resolve())

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
      id: user.id,
      username: user.username
    }))

    /** creating use case instance */
    const likeDislikeThreadCommentUseCase = new LikeDislikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
      userRepository: mockUserRepository
    })

    // Action
    await likeDislikeThreadCommentUseCase.execute(useCasePayload, user.id)

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-1')
    expect(mockThreadCommentRepository.checkThreadCommentAllow).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId
    })
    expect(mockThreadCommentLikeRepository.findThreadCommentLike).toHaveBeenCalledWith(new LikeDislikeThreadComment({
      commentId: useCasePayload.commentId,
      userId: user.id
    }))
    expect(mockThreadCommentLikeRepository.addThreadCommentLike).toHaveBeenCalledWith(new LikeDislikeThreadComment({
      commentId: useCasePayload.commentId,
      userId: user.id
    }))
  })

  it('should orchestrating the update thread comment action incorrectly', async () => {
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
    const mockThreadCommentLikeRepository = new IThreadCommentLikeRepository()

    /** mocking needed function */
    mockThreadCommentLikeRepository.findThreadCommentLike = jest.fn(() => Promise.resolve({ id: 'thread_comment_like-1', like_status: 0 }))
    mockThreadCommentLikeRepository.updateThreadCommentLike = jest.fn(() => Promise.resolve())

    mockThreadCommentRepository.checkThreadCommentAllow = jest.fn(() => Promise.resolve())

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
      id: user.id,
      username: user.username
    }))

    /** creating use case instance */
    const likeDislikeThreadCommentUseCase = new LikeDislikeThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
      userRepository: mockUserRepository
    })

    // Action
    await likeDislikeThreadCommentUseCase.execute(useCasePayload, user.id)

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-1')
    expect(mockThreadCommentRepository.checkThreadCommentAllow).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId
    })
    expect(mockThreadCommentLikeRepository.findThreadCommentLike).toHaveBeenCalledWith(new LikeDislikeThreadComment({
      commentId: useCasePayload.commentId,
      userId: user.id
    }))
    expect(mockThreadCommentLikeRepository.updateThreadCommentLike).toHaveBeenCalledWith({
      id: 'thread_comment_like-1',
      like_status: 0
    }, new LikeDislikeThreadComment({
      commentId: useCasePayload.commentId,
      userId: user.id
    }))
  })
})
