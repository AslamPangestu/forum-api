/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'thread_comment_likes'

const ThreadCommentLikesTableTestHelper = {
  async addThreadCommentLike ({
    id = 'thread_comment_like-1',
    commentId = 'thread_comment-1',
    userId = 'user-1'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, 0, NOW(), NOW(), $2, $3)`,
      values: [id, userId, commentId]
    }
    await pool.query(query)
  },

  async findThreadCommentLike (id, userId, commentId) {
    const query = {
      text: `SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND comment_id = $2 AND user_id = $3`,
      values: [id, commentId, userId]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE 1=1`)
  }
}

module.exports = ThreadCommentLikesTableTestHelper
