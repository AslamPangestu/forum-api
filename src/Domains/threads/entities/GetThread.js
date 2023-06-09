class GetThread {
  constructor (payloads) {
    this._verifyPayload(payloads)

    this.id = payloads[0].id
    this.title = payloads[0].title
    this.body = payloads[0].body
    this.date = this._convertDateToString(payloads[0].created_at)
    this.username = payloads[0].username
    this.comments = this._generateComments(payloads)
  }

  _verifyPayload (payloads) {
    if (!Array.isArray(payloads)) {
      throw new Error('GET_THREAD.NOT_AN_ARRAY')
    }

    const id = payloads[0].id
    const title = payloads[0].title
    const body = payloads[0].body
    const date = this._convertDateToString(payloads[0].created_at)
    const username = payloads[0].username

    if (!id || !username || !title || !body || !date) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || date === 'Invalid Date' || typeof username !== 'string') {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  _generateComments (payloads) {
    if (payloads.length === 1) {
      return []
    }
    const comments = payloads.filter(({ comment_id, reply_id }) => comment_id && !reply_id)
    const generateComment = (isDelete, content, defaut) => {
      if (isDelete) {
        return defaut
      }
      return content
    }
    return comments.map((item) => ({
      id: item.comment_id,
      username: item.comment_username,
      date: this._convertDateToString(item.comment_at),
      content: generateComment(item.comment_delete_at, item.comment_content, '**komentar telah dihapus**'),
      replies: payloads.filter(({ reply_id }) => reply_id && reply_id === item.comment_id).map(subitem => ({
        id: subitem.comment_id,
        username: subitem.comment_username,
        date: this._convertDateToString(subitem.comment_at),
        content: generateComment(subitem.comment_delete_at, subitem.comment_content, '**balasan telah dihapus**')
      }))
    }))
  }

  _convertDateToString (value) {
    return new Date(value).toISOString()
  }
}

module.exports = GetThread
