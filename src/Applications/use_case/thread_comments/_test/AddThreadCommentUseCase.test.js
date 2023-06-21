const IUserRepository = require('../../../../Domains/users/IUserRepository')
const IThreadCommentRepository = require('../../../../Domains/threadComments/IThreadCommentRepository')
const AddThreadComment = require('../../../../Domains/threadComments/entities/AddThreadComment')
const AddedThreadComment = require('../../../../Domains/threadComments/entities/AddedThreadComment')

const AddThreadCommentUseCase = require('../AddThreadCommentUseCase')

describe('AddThreadCommentUseCase', () => {
  /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment 1',
      threadId: 'thread-1'
    }
    const user = {
      id: 'user-1',
      username: 'dicoding'
    }

    /** creating dependency of use case */
    const mockThreadCommentRepository = new IThreadCommentRepository()
    const mockUserRepository = new IUserRepository()

    /** mocking needed function */
    mockThreadCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread_comment-1',
        content: useCasePayload.content
      }))

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: user.id,
        username: user.username
      }))

    /** creating use case instance */
    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      userRepository: mockUserRepository
    })

    // Action
    const addThread = await addThreadCommentUseCase.execute(useCasePayload, user.id)

    // Assert
    expect(addThread).toStrictEqual(new AddedThreadComment({
      id: 'thread_comment-1',
      content: useCasePayload.content,
      owner: user.username
    }))

    expect(mockUserRepository.getUserById).toBeCalledWith(user.id)

    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(new AddThreadComment({
      threadId: useCasePayload.threadId,
      content: useCasePayload.content
    }), user.id)
  })
})
