const LikeDislikeThreadComment = require('../../../Domains/threadComments/entities/LikeDislikeThreadComment')

class LikeDislikeThreadCommentUseCase {
  constructor ({ threadCommentRepository, threadCommentLikeRepository, userRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadCommentLikeRepository = threadCommentLikeRepository
    this._userRepository = userRepository
  }

  async execute (useCasePayload, userId) {
    await this._userRepository.getUserById(userId)
    await this._threadCommentRepository.checkThreadCommentAllow(useCasePayload)
    const likeDislikeThreadComment = new LikeDislikeThreadComment({ userId, commentId: useCasePayload.commentId })
    const data = await this._threadCommentLikeRepository.findThreadCommentLike(likeDislikeThreadComment)
    if (data) {
      await this._threadCommentLikeRepository.updateThreadCommentLike(data, likeDislikeThreadComment)
    } else {
      await this._threadCommentLikeRepository.addThreadCommentLike(likeDislikeThreadComment)
    }
  }
}

module.exports = LikeDislikeThreadCommentUseCase
