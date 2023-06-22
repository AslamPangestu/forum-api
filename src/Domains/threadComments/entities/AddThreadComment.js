class AddThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { content, threadId } = payload

    this.content = content
    this.threadId = threadId
    this.commentId = payload?.commentId || null
  }

  _verifyPayload ({ content, threadId }) {
    if (!content || !threadId) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddThreadComment
