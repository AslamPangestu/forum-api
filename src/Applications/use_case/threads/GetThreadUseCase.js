class GetThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const { threadId } = useCasePayload
    return this._threadRepository.findThreadById(threadId)
  }
}

module.exports = GetThreadUseCase
