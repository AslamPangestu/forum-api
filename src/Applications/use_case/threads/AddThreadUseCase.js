const AddThread = require('../../../Domains/threads/entities/AddThread')

class AddThreadUseCase {
  constructor ({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository
    this._userRepository = userRepository
  }

  async execute (useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload)
    const user = await this._userRepository.getUserById(userId)
    return this._threadRepository.addThread(addThread, user)
  }
}

module.exports = AddThreadUseCase
