const IThreadRepository = require('../../../../Domains/threads/IThreadRepository')
const GetThread = require('../../../../Domains/threads/entities/GetThread')

const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1'
    }

    /** creating dependency of use case */
    const mockThreadRepository = new IThreadRepository()

    /** mocking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new GetThread([
        {
          id: 'thread-1',
          title: 'Tittle Thread',
          body: 'Body Thread',
          date: '2023-06-04T13:29:54.057Z',
          user_id: 'user-1',
          username: 'dicoding'
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
        title: 'Tittle Thread',
        body: 'Body Thread',
        date: '2023-06-04T13:29:54.057Z',
        username: 'dicoding',
        comment_id: null,
        comment_content: null,
        comment_username: null,
        comment_at: null
      }
    ]))

    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId)
  })
})
