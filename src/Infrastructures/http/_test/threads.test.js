const pool = require('../../database/postgres/pool')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

let server = null
let token = null

describe('/threads endpoint', () => {
  beforeEach(async () => {
    server = await createServer(container)
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    beforeEach(async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret'
      }
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })
      token = JSON.parse(response.payload).data.accessToken
    })

    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'Dicoding Indonesia'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: ['Dicoding Indonesia']
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai')
    })
  })

  describe('when GET /threads/{id}', () => {
    it('should response 200 and return thread', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })

    it('should response 400 when thread not found', async () => {
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-2'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
  })
})
