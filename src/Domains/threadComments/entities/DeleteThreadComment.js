class DeleteThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { commentId, threadId } = payload

    this.commentId = commentId
    this.threadId = threadId
    this.replyId = payload?.replyId || null
  }

  _verifyPayload ({ commentId, threadId }) {
    if (!commentId || !threadId) {
      throw new Error('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DeleteThreadComment
