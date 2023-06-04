/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const TABLE_NAME = 'authentications'

const AuthenticationsTableTestHelper = {
  async addToken (token) {
    const query = {
      text: `INSERT INTO ${TABLE_NAME} VALUES($1)`,
      values: [token]
    }

    await pool.query(query)
  },

  async findToken (token) {
    const query = {
      text: `SELECT token FROM ${TABLE_NAME} WHERE token = $1`,
      values: [token]
    }

    const result = await pool.query(query)

    return result.rows
  },
  async cleanTable () {
    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE 1=1`)
  }
}

module.exports = AuthenticationsTableTestHelper
