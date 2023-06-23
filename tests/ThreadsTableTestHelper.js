/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'threads'

const ThreadsTestHelper = {
  async addThread ({
    id = 'thread-1',
    title = 'Tittle Thread',
    body = 'Body Thread',
    currentDate = '2023-06-04T13:29:54.057Z',
    userId = 'user-1'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $4, $4, $5)`,
      values: [id, title, body, currentDate, userId]
    }

    await pool.query(query)
  },

  async findThreadById (id) {
    const query = {
      text: `SELECT ${TABLE_NAME}.id, title, body, ${TABLE_NAME}.created_at, 
        users.username, 
        thread_comments.id AS comment_id, thread_comments.created_at AS comment_at, thread_comments.comment_id AS reply_id, 
        thread_comments.soft_delete_at AS comment_delete_at, thread_comments.content AS comment_content, 
        (SELECT users.username FROM users WHERE users.id = thread_comments.user_id) comment_username
        FROM ${TABLE_NAME} 
        LEFT JOIN thread_comments ON ${TABLE_NAME}.id = thread_comments.thread_id
        INNER JOIN users ON ${TABLE_NAME}.user_id = users.id
        WHERE ${TABLE_NAME}.id = $1 
        ORDER BY comment_at ASC`,
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE 1=1`)
  }
}

module.exports = ThreadsTestHelper
