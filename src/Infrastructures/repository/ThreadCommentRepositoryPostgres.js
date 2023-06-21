const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const IThreadCommentRepository = require('../../Domains/threadComments/IThreadCommentRepository')

const TABLE_NAME = 'thread_comments'

class ThreadRepositoryPostgres extends IThreadCommentRepository {
  constructor (pool, idGenerator, currentDateGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
    this._currentDateGenerator = currentDateGenerator
  }

  async addThreadComment (addThreadComment, userId) {
    const { content, thread_id } = addThreadComment
    const generatedId = this._idGenerator('thread_comments')

    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $3, NULL, $4, $5, NULL) RETURNING id, content`,
      values: [generatedId, content, this._currentDateGenerator(), userId, thread_id]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async checkThreadCommentAllow (checkThreadCommentAllow, userId) {
    const { comment_id, thread_id } = checkThreadCommentAllow
    const query = {
      text: `SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND thread_id = $2 AND soft_delete_at IS NULL`,
      values: [comment_id, thread_id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('threadComment tidak ditemukan')
    }

    const data = result.rows[0]

    if (data.user_id !== userId) {
      throw new AuthorizationError('thread comment tidak bisa diakses')
    }
  }

  async deleteThreadComment (deleteThreadComment, userId) {
    const { comment_id, thread_id } = deleteThreadComment
    const query = {
      text: `UPDATE ${TABLE_NAME} SET soft_delete_at = $2 WHERE id = $1 AND thread_id = $3 AND soft_delete_at IS NULL AND user_id = $4`,
      values: [comment_id, this._currentDateGenerator(), thread_id, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('threadComment tidak ditemukan')
    }
  }
}

module.exports = ThreadRepositoryPostgres
