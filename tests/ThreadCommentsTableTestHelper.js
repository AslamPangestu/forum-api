/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'thread_comments'

const ThreadCommentsTableTestHelper = {
  async addThreadComment ({
    id = 'thread_comment-1',
    content = 'comment 1',
    threadId = 'thread-1',
    currentDate = '2023-06-04T13:29:54.057Z',
    userId = 'user-1'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $3, NULL, $4, $5, NULL)`,
      values: [id, content, currentDate, userId, threadId]
    }
    await pool.query(query)
  },

  async addThreadCommentReply ({
    id = 'thread_comment-2',
    content = 'comment reply 1',
    threadId = 'thread-1',
    commentId = 'thread_comment-1',
    currentDate = '2023-06-04T13:29:54.057Z',
    userId = 'user-1'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $3, NULL, $4, $5, $6)`,
      values: [id, content, currentDate, userId, threadId, commentId]
    }
    await pool.query(query)
  },

  async deleteThreadCommentById (id, currentDate = '2023-06-04T13:29:54.057Z') {
    const query = {
      text: `UPDATE ${TABLE_NAME} SET soft_delete_at = $2 WHERE id = $1`,
      values: [id, currentDate]
    }
    const result = await pool.query(query)
    return result.rows
  },

  async deleteThreadCommentReplyById (id, commentId, currentDate = '2023-06-04T13:29:54.057Z') {
    const query = {
      text: `UPDATE ${TABLE_NAME} SET soft_delete_at = $3 WHERE id = $1 AND comment_id = $2`,
      values: [id, commentId, currentDate]
    }
    const result = await pool.query(query)
    return result.rows
  }
}

module.exports = ThreadCommentsTableTestHelper
