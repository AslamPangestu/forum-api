const AddThread = require('../../../../Domains/threads/entities/AddThread')
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
      title: 'dicoding',
      body: 'Dicoding Indonesia'
    }
    const user = {
      id: 'user-1',
      username: 'User 1'
    }

    /** creating dependency of use case */
    const mockThreadRepository = new IThreadRepository()
    const mockUserRepository = new IUserRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-1',
        title: useCasePayload.title,
        owner: user.username
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
    expect(addThread).toStrictEqual({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: user.username
    })

    expect(mockUserRepository.getUserById).toBeCalledWith('user-1')

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body
    }), user)
  })
})
