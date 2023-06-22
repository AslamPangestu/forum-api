const NotFoundError = require('../../Commons/exceptions/NotFoundError')

const IThreadRepository = require('../../Domains/threads/IThreadRepository')
const GetThread = require('../../Domains/threads/entities/GetThread')

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

  async findThreadById (id) {
    const query = {
      text: `SELECT ${TABLE_NAME}.id, title, body, ${TABLE_NAME}.created_at AS date, 
        users.username, 
        thread_comments.id AS comment_id, thread_comments.created_at AS comment_at, thread_comments.comment_id AS reply_id, 
        CASE 
          WHEN thread_comments.soft_delete_at IS NOT NULL AND thread_comments.comment_id IS NULL THEN '**komentar telah dihapus**' 
          WHEN thread_comments.soft_delete_at IS NOT NULL AND thread_comments.comment_id IS NOT NULL THEN '**balasan telah dihapus**' 
          ELSE thread_comments.content 
        END AS comment_content, 
        (SELECT users.username FROM users WHERE users.id = thread_comments.user_id) comment_username
        FROM ${TABLE_NAME} 
        LEFT JOIN thread_comments ON ${TABLE_NAME}.id = thread_comments.thread_id
        INNER JOIN users ON ${TABLE_NAME}.user_id = users.id
        WHERE ${TABLE_NAME}.id = $1 
        ORDER BY comment_at ASC`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return new GetThread(result.rows)
  }
}

module.exports = ThreadRepositoryPostgres
