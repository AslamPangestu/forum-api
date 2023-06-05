const InvariantError = require('../../Commons/exceptions/InvariantError')
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser')
const IUserRepository = require('../../Domains/users/IUserRepository')

class UserRepositoryPostgres extends IUserRepository {
  constructor (pool, idGenerator, currentDateGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
    this._currentDateGenerator = currentDateGenerator
  }

  async verifyAvailableUsername (username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia')
    }
  }

  async addUser (registerUser) {
    const { username, password, fullname } = registerUser
    const id = `user-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $5) RETURNING id, username, fullname',
      values: [id, username, password, fullname, this._currentDateGenerator()]
    }

    const result = await this._pool.query(query)

    return new RegisteredUser({ ...result.rows[0] })
  }

  async getPasswordByUsername (username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan')
    }

    return result.rows[0].password
  }

  async getIdByUsername (username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan')
    }

    const { id } = result.rows[0]

    return id
  }
}

module.exports = UserRepositoryPostgres
