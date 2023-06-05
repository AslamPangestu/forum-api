const GetThread = require('../../../../Domains/threads/entities/GetThread')
const IThreadRepository = require('../../../../Domains/threads/IThreadRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-1'
    }

    /** creating dependency of use case */
    const mockThreadRepository = new IThreadRepository()

    /** mocking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new GetThread([
        {
          id: 'thread-1',
          title: 'abc',
          body: 'abc',
          created_at: '2023-06-04T13:29:54.057Z',
          username: 'Username 1'
        }
      ])))

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(getThread).toEqual(new GetThread([
      {
        id: 'thread-1',
        title: 'abc',
        body: 'abc',
        created_at: '2023-06-04T13:29:54.057Z',
        username: 'Username 1'
      }
    ]))

    expect(mockThreadRepository.findThreadById).toBeCalledWith({
      id: 'thread-1'
    })
  })
})
