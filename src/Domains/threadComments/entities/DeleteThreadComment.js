class DeleteThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { comment_id, thread_id } = payload

    this.comment_id = comment_id
    this.thread_id = thread_id
  }

  _verifyPayload ({ comment_id, thread_id }) {
    if (!comment_id || !thread_id) {
      throw new Error('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof comment_id !== 'string' || typeof thread_id !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DeleteThreadComment
