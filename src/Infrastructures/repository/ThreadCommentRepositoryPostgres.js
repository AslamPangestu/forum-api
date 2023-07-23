const NotFoundError = require('../../Commons/exceptions/NotFoundError')

const IThreadCommentRepository = require('../../Domains/threadComments/IThreadCommentRepository')

const TABLE_NAME = 'thread_comments'

class ThreadRepositoryPostgres extends IThreadCommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThreadComment (addThreadComment, userId) {
    const { content, threadId } = addThreadComment
    const generatedId = this._idGenerator('thread_comments')

    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, NOW(), NOW(), NULL, $3, $4, $5) RETURNING id, content`,
      values: [generatedId, content, userId, threadId, addThreadComment?.commentId || null]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async checkThreadCommentAllow (checkThreadCommentAllow) {
    const { commentId, threadId } = checkThreadCommentAllow
    let baseQuery = `SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND thread_id = $2 AND soft_delete_at IS NULL`
    const baseParam = [commentId, threadId]

    if (checkThreadCommentAllow?.replyId) {
      baseQuery += ' AND comment_id = $3'
      baseParam[0] = checkThreadCommentAllow?.replyId
      baseParam.push(checkThreadCommentAllow.commentId)
    }
    const query = {
      text: baseQuery,
      values: baseParam
    }

    const result = await this._pool.query(query)

    console.log(result.rows)

    if (!result.rowCount) {
      throw new NotFoundError('tidak dapat mengakses komentar thread karena thread atau komentar thread tidak ditemukan')
    }

    return result.rows[0]
  }

  async deleteThreadComment (deleteThreadComment, userId) {
    const { commentId, threadId } = deleteThreadComment
    let baseQuery = `UPDATE ${TABLE_NAME} SET soft_delete_at = NOW() WHERE id = $1 AND thread_id = $2 AND soft_delete_at IS NULL AND user_id = $3`
    const baseParam = [commentId, threadId, userId]
    if (deleteThreadComment?.replyId) {
      baseQuery += ' AND comment_id = $4'
      baseParam[0] = deleteThreadComment?.replyId
      baseParam.push(deleteThreadComment.commentId)
    }
    const query = {
      text: baseQuery,
      values: baseParam
    }

    await this._pool.query(query)
  }
}

module.exports = ThreadRepositoryPostgres
