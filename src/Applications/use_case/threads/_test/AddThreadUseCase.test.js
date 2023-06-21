const AddThread = require('../../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../../Domains/threads/entities/AddedThread')
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository')
const IUserRepository = require('../../../../Domains/users/IUserRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Tittle Thread',
      body: 'Body Thread'
    }
    const user = {
      id: 'user-1',
      username: 'dicoding'
    }

    /** creating dependency of use case */
    const mockThreadRepository = new IThreadRepository()
    const mockUserRepository = new IUserRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-1',
        title: useCasePayload.title
      }))

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: user.id,
        username: user.username
      }))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    })

    // Action
    const addThread = await addThreadUseCase.execute(useCasePayload, user.id)

    // Assert
    expect(addThread).toStrictEqual(new AddedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: user.username
    }))

    expect(mockUserRepository.getUserById).toBeCalledWith(user.id)

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body
    }), user.id)
  })
})
