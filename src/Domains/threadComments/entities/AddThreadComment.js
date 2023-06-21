class AddThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { content, thread_id, comment_id } = payload

    this.content = content
    this.thread_id = thread_id
    this.comment_id = comment_id || null
  }

  _verifyPayload ({ content, thread_id }) {
    if (!content || !thread_id) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof thread_id !== 'string') {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddThreadComment
