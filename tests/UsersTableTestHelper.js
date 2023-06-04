/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'users'

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-1',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
    currentDate = '2023-06-04T13:29:54.057Z'
  }) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1, $2, $3, $4, $5, $5)`,
      values: [id, username, password, fullname, currentDate]
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
