const AddThread = require('../../../../Domains/threads/entities/AddThread')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
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

    const mockAddThread = new AddThread({
      id: 'thread-1',
      title: useCasePayload.title,
      body: useCasePayload.body
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddThread))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addThread).toStrictEqual('thread-1')

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      id: 'thread-1',
      title: useCasePayload.title,
      body: useCasePayload.body
    }))
  })
})
