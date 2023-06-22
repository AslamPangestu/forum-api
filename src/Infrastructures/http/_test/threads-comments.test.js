const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')

const pool = require('../../database/postgres/pool')
const container = require('../../container')

const createServer = require('../createServer')

let server, token

describe('/thread/{threadId}/comments endpoint', () => {
  beforeEach(async () => {
    server = await createServer(container)
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }
    })

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret'
      }
    })
    token = JSON.parse(responseAuth.payload).data.accessToken
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    describe('and thread exist', () => {
      let threadId

      beforeEach(async () => {
        const requestThreadPayload = {
          title: 'Tittle Thread',
          body: 'Body Thread'
        }
        const responseThread = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: { Authorization: `Bearer ${token}` },
          payload: requestThreadPayload
        })
        threadId = JSON.parse(responseThread.payload).data.addedThread.id
      })

      it('should response 201 and persisted threadComment', async () => {
        // Arrange
        const requestPayload = {
          content: 'comment 1'
        }

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(201)
        expect(responseJson.status).toEqual('success')
        expect(responseJson.data.addedComment).toBeDefined()
      })

      it('should response 400 when request payload not contain needed property', async () => {
        // Arrange
        const requestPayload = {}

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(400)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('tidak dapat membuat komentar thread baru karena properti yang dibutuhkan tidak ada')
      })

      it('should response 400 when request payload not meet data type specification', async () => {
        // Arrange
        const requestPayload = {
          content: ['Dicoding Indonesia']
        }

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(400)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('tidak dapat membuat komentar thread baru karena tipe data tidak sesuai')
      })
    })

    it('should response 404 when comment thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment 1'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat komentar thread baru karena thread tidak ditemukan')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    describe('and thread exist', () => {
      let threadId, commentId

      beforeEach(async () => {
        const requestThreadPayload = {
          title: 'Tittle Thread',
          body: 'Body Thread'
        }
        const responseThread = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: { Authorization: `Bearer ${token}` },
          payload: requestThreadPayload
        })
        threadId = JSON.parse(responseThread.payload).data.addedThread.id

        // Arrange
        const requestCommentPayload = {
          content: 'comment 1'
        }

        // Action
        const responseComment = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestCommentPayload,
          headers: { Authorization: `Bearer ${token}` }
        })
        commentId = JSON.parse(responseComment.payload).data.addedComment.id
      })

      it('should response 200', async () => {
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')
      })

      it('should response 403 when thread comment is different owner', async () => {
        // Arrange
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding1',
            password: 'secret',
            fullname: 'Dicoding Indonesia 1'
          }
        })

        const responseAuth = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding1',
            password: 'secret'
          }
        })
        const token2 = JSON.parse(responseAuth.payload).data.accessToken

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: { Authorization: `Bearer ${token2}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(403)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('tidak dapat menghapus komentar thread karena user tidak sesuai')
      })
    })

    it('should response 404 when thread or comment not found', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1',
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat mengakses komentar thread karena thread atau komentar thread tidak ditemukan')
    })
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    describe('and thread exist', () => {
      let threadId, commentId

      beforeEach(async () => {
        const requestThreadPayload = {
          title: 'Tittle Thread',
          body: 'Body Thread'
        }
        const responseThread = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: { Authorization: `Bearer ${token}` },
          payload: requestThreadPayload
        })
        threadId = JSON.parse(responseThread.payload).data.addedThread.id

        const requestCommentPayload = {
          content: 'comment 1'
        }
        const responseComment = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          headers: { Authorization: `Bearer ${token}` },
          payload: requestCommentPayload
        })
        commentId = JSON.parse(responseComment.payload).data.addedComment.id
      })

      it('should response 201 and persisted threadComment', async () => {
        // Arrange
        const requestPayload = {
          content: 'comment 1'
        }

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: requestPayload,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(201)
        expect(responseJson.status).toEqual('success')
        expect(responseJson.data.addedReply).toBeDefined()
      })

      it('should response 400 when request payload not contain needed property', async () => {
        // Arrange
        const requestPayload = {}

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: requestPayload,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(400)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('tidak dapat membuat komentar thread baru karena properti yang dibutuhkan tidak ada')
      })

      it('should response 400 when request payload not meet data type specification', async () => {
        // Arrange
        const requestPayload = {
          content: ['Dicoding Indonesia']
        }

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: requestPayload,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(400)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('tidak dapat membuat komentar thread baru karena tipe data tidak sesuai')
      })
    })

    it('should response 404 when comment thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment 1'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments/2/replies',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat komentar thread baru karena thread tidak ditemukan')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    describe('and thread exist', () => {
      let threadId, commentId, replyId

      beforeEach(async () => {
        const requestThreadPayload = {
          title: 'Tittle Thread',
          body: 'Body Thread'
        }
        const responseThread = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: { Authorization: `Bearer ${token}` },
          payload: requestThreadPayload
        })
        threadId = JSON.parse(responseThread.payload).data.addedThread.id

        const requestCommentPayload = {
          content: 'comment 1'
        }
        const responseComment = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestCommentPayload,
          headers: { Authorization: `Bearer ${token}` }
        })
        commentId = JSON.parse(responseComment.payload).data.addedComment.id

        const responseReply = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments/${commentId}/replies`,
          payload: requestCommentPayload,
          headers: { Authorization: `Bearer ${token}` }
        })
        replyId = JSON.parse(responseReply.payload).data.addedReply.id
      })

      it('should response 200', async () => {
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
          headers: { Authorization: `Bearer ${token}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')
      })

      it('should response 403 when thread comment is different owner', async () => {
        // Arrange
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding1',
            password: 'secret',
            fullname: 'Dicoding Indonesia 1'
          }
        })

        const responseAuth = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding1',
            password: 'secret'
          }
        })
        const token2 = JSON.parse(responseAuth.payload).data.accessToken

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
          headers: { Authorization: `Bearer ${token2}` }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(403)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('tidak dapat menghapus komentar thread karena user tidak sesuai')
      })
    })

    it('should response 404 when thread or comment not found', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1/replies/2',
        headers: { Authorization: `Bearer ${token}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat mengakses komentar thread karena thread atau komentar thread tidak ditemukan')
    })
  })
})
