/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'users'

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-1',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $4, NOW(), NOW())`,
      values: [id, username, password, fullname]
    }

    await pool.query(query)
  },

  async findUsersById (id) {
    const query = {
      text: `SELECT * FROM ${TABLE_NAME} WHERE id = $1`,
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE 1=1`)
  }
}

module.exports = UsersTableTestHelper
