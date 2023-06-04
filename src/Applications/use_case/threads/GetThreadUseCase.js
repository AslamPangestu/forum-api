class GetThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    this._verifyPayload(useCasePayload)
    const { id } = useCasePayload
    return this._threadRepository.findThreadById(id)
  }

  _verifyPayload ({ id }) {
    if (!id) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_ID')
    }

    if (typeof id !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = GetThreadUseCase
