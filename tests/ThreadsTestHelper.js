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
      text: `SELECT * FROM ${TABLE_NAME} 
      JOIN thread_comments ON ${TABLE_NAME}.id = thread_comments.thread_id
      JOIN users ON ${TABLE_NAME}.user_id = users.id
      WHERE id = $1`,
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  }
}

module.exports = ThreadsTestHelper
