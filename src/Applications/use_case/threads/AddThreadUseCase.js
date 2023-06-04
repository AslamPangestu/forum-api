const AddThread = require('../../../Domains/threads/entities/AddThread')

class AddUserUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const addThread = new AddThread(useCasePayload)
    return this._threadRepository.addUser(addThread)
  }
}

module.exports = AddUserUseCase
