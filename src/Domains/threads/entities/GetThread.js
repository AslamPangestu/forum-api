class GetThread {
  constructor (payloads) {
    this._verifyPayload(payloads)

    this.id = payloads[0].id
    this.title = payloads[0].title
    this.body = payloads[0].body
    this.date = new Date(payloads[0].date).toISOString()
    this.username = payloads[0].username
    // TODO: Implement List Comments with Replies
    // this.comments = this._generateComments(payloads)
  }

  _verifyPayload (payloads) {
    if (!Array.isArray(payloads) || !payloads.length) {
      throw new Error('THREAD.NOT_FOUND')
    }

    const id = payloads[0].id
    const title = payloads[0].title
    const body = payloads[0].body
    const date = new Date(payloads[0].date).toString()
    const username = payloads[0].username

    if (!id || !username || !title || !body || !date) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || date === 'Invalid Date' || typeof username !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  // TODO: Implement List Comments with Replies
  // _generateComments (payloads) {}
}

module.exports = GetThread
