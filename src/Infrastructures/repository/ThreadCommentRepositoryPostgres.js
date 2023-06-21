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
    const { content, threadId } = addThreadComment
    const generatedId = this._idGenerator('thread_comments')

    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $3, NULL, $4, $5, NULL) RETURNING id, content`,
      values: [generatedId, content, this._currentDateGenerator(), userId, threadId]
    }

    try {
      const result = await this._pool.query(query)

      return result.rows[0]
    } catch (error) {
      if (error.message === 'insert or update on table "thread_comments" violates foreign key constraint "thread_comments_thread_id_fkey"') {
        throw new NotFoundError('tidak dapat membuat komentar thread baru karena thread tidak ditemukan')
      }
    }
  }

  async checkThreadCommentAllow (checkThreadCommentAllow, userId) {
    const { commentId, threadId } = checkThreadCommentAllow
    const query = {
      text: `SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND thread_id = $2 AND soft_delete_at IS NULL`,
      values: [commentId, threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('tidak dapat mengakses komentar thread karena thread atau komentar thread tidak ditemukan')
    }

    const data = result.rows[0]

    if (data.user_id !== userId) {
      throw new AuthorizationError('tidak dapat menghapus komentar thread karena user tidak sesuai')
    }
  }

  async deleteThreadComment (deleteThreadComment, userId) {
    const { commentId, threadId } = deleteThreadComment
    const query = {
      text: `UPDATE ${TABLE_NAME} SET soft_delete_at = $2 WHERE id = $1 AND thread_id = $3 AND soft_delete_at IS NULL AND user_id = $4`,
      values: [commentId, this._currentDateGenerator(), threadId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('tidak dapat menghapus komentar thread karena thread atau komentar thread tidak ditemukan')
    }
  }
}

module.exports = ThreadRepositoryPostgres
