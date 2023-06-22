class GetThread {
  constructor (payloads) {
    this._verifyPayload(payloads)

    this.id = payloads[0].id
    this.title = payloads[0].title
    this.body = payloads[0].body
    this.date = new Date(payloads[0].date).toISOString()
    this.username = payloads[0].username
    this.comments = this._generateComments(payloads)
  }

  _verifyPayload (payloads) {
    const id = payloads[0].id
    const title = payloads[0].title
    const body = payloads[0].body
    const date = new Date(payloads[0].date).toString()
    const username = payloads[0].username

    if (!id || !username || !title || !body || !date) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || date === 'Invalid Date' || typeof username !== 'string') {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  _generateComments (payloads = []) {
    if (payloads.length === 1) {
      return []
    }
    const comments = payloads.filter(({ comment_id, reply_id }) => comment_id && !reply_id)
    return comments.map((item) => ({
      id: item.comment_id,
      username: item.comment_username,
      date: item.comment_at,
      content: item.comment_content,
      replies: payloads.filter(({ reply_id }) => reply_id && reply_id === item.comment_id).map(subitem => ({
        id: subitem.comment_id,
        username: subitem.comment_username,
        date: subitem.comment_at,
        content: subitem.comment_content
      }))
    }))
  }
}

module.exports = GetThread
