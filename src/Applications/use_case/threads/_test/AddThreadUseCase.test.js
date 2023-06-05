const AddThread = require('../../../../Domains/threads/entities/AddThread')
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository')
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

    /** creating dependency of use case */
    const mockThreadRepository = new IThreadRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-1'))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addThread).toStrictEqual('thread-1')

    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body
    }))
  })
})
