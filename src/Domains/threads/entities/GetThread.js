class GetThread {
  constructor (payloads) {
    this._verifyPayload(payloads)

    console.log(payloads)

    this.id = payloads[0].id
    this.title = payloads[0].title
    this.body = payloads[0].body
    this.date = new Date(payloads[0].date).toISOString()
    this.username = payloads[0].username
    // TODO: Implement List Comments with Replies
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

  // TODO: Implement List Comments with Replies
  _generateComments (payloads = []) {
    return payloads.map(item => ({
      id: item.comment_id,
      username: item.comment_username,
      date: item.comment_at,
      content: item.content
    }))
  }
}

module.exports = GetThread
