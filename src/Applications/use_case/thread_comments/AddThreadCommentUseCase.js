const AddThreadComment = require('../../../Domains/threadComments/entities/AddThreadComment')
const AddedThreadComment = require('../../../Domains/threadComments/entities/AddedThreadComment')

class AddThreadCommentUseCase {
  constructor ({ threadRepository, threadCommentRepository, userRepository }) {
    this._threadRepository = threadRepository
    this._threadCommentRepository = threadCommentRepository
    this._userRepository = userRepository
  }

  async execute (useCasePayload, userId) {
    const addThreadComment = new AddThreadComment(useCasePayload)
    const user = await this._userRepository.getUserById(userId)
    await this._threadRepository.checkThreadExist(addThreadComment.threadId, 'tidak dapat membuat komentar thread baru')
    const threadComment = await this._threadCommentRepository.addThreadComment(addThreadComment, userId)
    return new AddedThreadComment({
      ...threadComment,
      owner: user.username
    })
  }
}

module.exports = AddThreadCommentUseCase
