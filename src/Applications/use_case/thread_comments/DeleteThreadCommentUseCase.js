const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const DeleteThreadComment = require('../../../Domains/threadComments/entities/DeleteThreadComment')

class DeleteThreadCommentUseCase {
  constructor ({ threadCommentRepository, userRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._userRepository = userRepository
  }

  async execute (useCasePayload, userId) {
    const deleteThreadComment = new DeleteThreadComment(useCasePayload)
    await this._userRepository.getUserById(userId)
    const threadComment = await this._threadCommentRepository.checkThreadCommentAllow(useCasePayload)
    console.log(threadComment, useCasePayload)
    if (threadComment.user_id !== userId) {
      throw new AuthorizationError('tidak dapat menghapus komentar thread karena user tidak sesuai')
    }
    await this._threadCommentRepository.deleteThreadComment(deleteThreadComment, userId)
  }
}

module.exports = DeleteThreadCommentUseCase
