class IThreadCommentRepository {
  async addThreadComment (addThreadComment, userId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteThreadComment (deleteThreadComment, userId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkThreadCommentAllow (checkThreadCommentAllow, userId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = IThreadCommentRepository
