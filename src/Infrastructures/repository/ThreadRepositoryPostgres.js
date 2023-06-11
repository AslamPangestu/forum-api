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

  async addThread (addThread, userId) {
    const { title, body } = addThread
    const generatedId = this._idGenerator('thread')

    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $4, $4, $5) RETURNING id, title`,
      values: [generatedId, title, body, this._currentDateGenerator(), userId]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async getThreadById (id) {
    const query = {
      text: `SELECT ${TABLE_NAME}.id, title, body, ${TABLE_NAME}.created_at AS date, 
        users.username, 
        thread_comments.id AS comment_id
        FROM ${TABLE_NAME} 
        LEFT JOIN thread_comments ON ${TABLE_NAME}.id = thread_comments.thread_id
        INNER JOIN users ON ${TABLE_NAME}.user_id = users.id
        WHERE ${TABLE_NAME}.id = $1`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('thread tidak ditemukan')
    }

    return new GetThread(result.rows)
  }
}

module.exports = ThreadRepositoryPostgres
