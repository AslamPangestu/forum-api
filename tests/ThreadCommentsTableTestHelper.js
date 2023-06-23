/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'thread_comments'

const ThreadCommentsTableTestHelper = {
  async addThreadComment ({
    id = 'thread_comment-1',
    content = 'comment 1',
    threadId = 'thread-1',
    commentId = null,
    currentDate = '2023-06-04T13:29:54.057Z',
    userId = 'user-1'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $3, NULL, $4, $5, $6)`,
      values: [id, content, currentDate, userId, threadId, commentId]
    }
    await pool.query(query)
  },

  async findThreadComment (id, threadId, userId, commentId) {
    let baseQuery = `SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND thread_id = $2 AND user_id = $3`
    const baseParam = [id, threadId, userId]
    if (commentId) {
      baseQuery += ' AND comment_id = $4'
      baseParam[0] = commentId
      baseParam.push(id)
    }
    const query = {
      text: baseQuery,
      values: baseParam
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE 1=1`)
  }
}

module.exports = ThreadCommentsTableTestHelper
