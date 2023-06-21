const DeleteThreadComment = require('../../../Domains/threadComments/entities/DeleteThreadComment')

class DeleteThreadCommentUseCase {
  constructor ({ threadCommentRepository, userRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._userRepository = userRepository
  }

  async execute (useCasePayload, userId) {
    const deleteThreadComment = new DeleteThreadComment(useCasePayload)
    await this._userRepository.getUserById(userId)
    await this._threadCommentRepository.checkThreadCommentAllow(deleteThreadComment, userId)
    await this._threadCommentRepository.deleteThreadComment(deleteThreadComment, userId)
  }
}

module.exports = DeleteThreadCommentUseCase
