const InvariantError = require('../../Commons/exceptions/InvariantError')
const GetThread = require('../../Domains/threads/entities/GetThread')
const IThreadRepository = require('../../Domains/threads/IThreadRepository')

const TABLE_NAME = 'threads'

class ThreadRepositoryPostgres extends IThreadRepository {
  constructor (pool, idGenerator, currentDateGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
    this._currentDateGenerator = currentDateGenerator
  }

  async addThread (addThread) {
    const { title, body } = addThread
    const generatedId = `thread-${this._idGenerator()}`

    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $4, $4, $5) RETURNING id`,
      values: [generatedId, title, body, this._currentDateGenerator(), userId]
    }

    const result = await this._pool.query(query)

    const { id } = result.rows[0]

    return id
  }

  async getThreadById (id) {
    const query = {
      text: `SELECT * FROM ${TABLE_NAME} 
        JOIN thread_comments ON ${TABLE_NAME}.id = thread_comments.thread_id
        JOIN users ON ${TABLE_NAME}.user_id = users.id
        WHERE id = $1`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('thread tidak ditemukan')
    }

    return GetThread(result.rows)
  }
}

module.exports = ThreadRepositoryPostgres
