const AddThread = require('../../../Domains/threads/entities/AddThread')

class AddThreadUseCase {
  constructor ({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository
    this._userRepository = userRepository
  }

  async execute (useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload)
    const user = await this._userRepository.getUserById(userId)
    const thread = await this._threadRepository.addThread(addThread, userId)
    return {
      ...thread,
      owner: user.username
    }
  }
}

module.exports = AddThreadUseCase
