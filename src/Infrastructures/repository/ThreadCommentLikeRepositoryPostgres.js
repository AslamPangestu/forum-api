const IThreadCommentLikeRepository = require('../../Domains/threadComments/IThreadCommentLikeRepository')

const TABLE_NAME = 'thread_comment_likes'

class ThreadRepositoryPostgres extends IThreadCommentLikeRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThreadCommentLike (addThreadCommentLike) {
    const { userId, commentId } = addThreadCommentLike
    const generatedId = this._idGenerator('thread_comments')

    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, 0, NOW(), NOW(), $2, $3) RETURNING id`,
      values: [generatedId, userId, commentId]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async updateThreadCommentLike (threadCommentLike, updateThreadCommentLike) {
    const { userId, commentId } = updateThreadCommentLike
    const { id, like_status } = threadCommentLike

    const query = {
      text: `UPDATE ${TABLE_NAME} SET like_status = $4, updated_at = NOW() WHERE id = $1 AND comment_id = $2 AND user_id = $3 RETURNING id`,
      values: [id, userId, commentId, like_status === 1 ? 0 : 1]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async findThreadCommentLike (findThreadCommentLike) {
    const { userId, commentId } = findThreadCommentLike

    const query = {
      text: `SELECT * FROM ${TABLE_NAME} WHERE comment_id = $1 AND user_id = $2`,
      values: [userId, commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return null
    }

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres
