const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

const AddThreadComment = require('../../../Domains/threadComments/entities/AddThreadComment')
const DeleteThreadComment = require('../../../Domains/threadComments/entities/DeleteThreadComment')

const pool = require('../../database/postgres/pool')

const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres')

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThreadComment function', () => {
    let threadCommentRepositoryPostgres

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
    })

    describe('and no reply', () => {
      beforeEach(async () => {
        // Arrange
        const fakeIdGenerator = () => 'thread_comment-1' // stub!
        threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)
      })

      describe('and thread does not exist', () => {
        it('should throw NotFoundError when thread not found', async () => {
          // Arrange
          const addThreadComment = new AddThreadComment({
            content: 'comment 1',
            threadId: 'thread-3'
          })

          // Action & Assert
          return expect(threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1'))
            .rejects
            .toThrowError('tidak dapat membuat komentar thread baru karena thread tidak ditemukan')
        })
      })

      describe('and thread exist', () => {
        let addThreadComment

        beforeEach(async () => {
          // Arrange
          await ThreadsTableTestHelper.addThread({
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            userId: 'user-1'
          })
          addThreadComment = new AddThreadComment({
            content: 'comment 1',
            threadId: 'thread-1'
          })
        })

        it('should persist threadComment and return threadComment correctly', async () => {
          // Action
          await threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1')

          // Assert
          const threadComments = await ThreadCommentsTableTestHelper.findThreadComment('thread_comment-1', 'thread-1', 'user-1')
          expect(threadComments.length).toBeGreaterThan(0)
        })

        it('should return threadComment correctly', async () => {
          // Action
          const threadComment = await threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1')

          // Assert
          expect(threadComment).toStrictEqual({ id: 'thread_comment-1', content: 'comment 1' })
        })
      })
    })

    describe('and with reply', () => {
      beforeEach(async () => {
        // Arrange
        await ThreadsTableTestHelper.addThread({
          id: 'thread-1',
          title: 'Tittle Thread',
          body: 'Body Thread',
          userId: 'user-1'
        })
        const fakeIdGenerator = () => 'thread_comment-2' // stub!
        threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)
      })

      describe('and thread comment does not exist', () => {
        it('should throw NotFoundError when thread comment not found', async () => {
          // Arrange
          const addThreadComment = new AddThreadComment({
            content: 'comment 1',
            threadId: 'thread-1',
            commentId: 'thread_comment-3'
          })

          // Action & Assert
          return expect(threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1'))
            .rejects
            .toThrowError(NotFoundError)
        })
      })

      describe('and thread comment exist', () => {
        let addThreadComment

        beforeEach(async () => {
          // Arrange
          await ThreadCommentsTableTestHelper.addThreadComment({
            id: 'thread_comment-1',
            content: 'comment 1',
            threadId: 'thread-1',
            userId: 'user-1'
          })
          addThreadComment = new AddThreadComment({
            content: 'comment 1',
            threadId: 'thread-1',
            commentId: 'thread_comment-1'
          })
        })

        it('should persist threadComment and return threadComment correctly', async () => {
          // Action
          await threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1')

          // Assert
          const threadComments = await ThreadCommentsTableTestHelper.findThreadComment('thread_comment-1', 'thread-1', 'user-1', 'thread_comment-2')
          expect(threadComments.length).toBeGreaterThan(0)
        })

        it('should return threadComment correctly', async () => {
          // Action
          const threadComment = await threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1')

          // Assert
          expect(threadComment).toStrictEqual({ id: 'thread_comment-2', content: 'comment 1' })
        })
      })
    })
  })

  describe('checkThreadCommentAllow function', () => {
    let threadCommentRepositoryPostgres

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding', fullname: 'Dicoding 1' })
      threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {}, {})
    })

    describe('and no reply', () => {
      describe('and thread does not exist', () => {
        it('should throw NotFoundError when threadComment not found', () => {
          // Action & Assert
          return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow({ commentId: 'thread_comment-1', threadId: 'thread-1' }, 'user-1'))
            .rejects
            .toThrowError(NotFoundError)
        })
      })

      describe('and thread exist', () => {
        beforeEach(async () => {
          // Arrange
          await ThreadsTableTestHelper.addThread({
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            userId: 'user-1'
          })
          await ThreadCommentsTableTestHelper.addThreadComment({
            id: 'thread_comment-1',
            content: 'comment 1',
            userId: 'user-1',
            threadId: 'thread-1'
          })
        })

        it('should throw AuthorizationError when threadComment is different owner', async () => {
          // Arrange
          await UsersTableTestHelper.addUser({ id: 'user-2', username: 'dicoding 2', fullname: 'Dicoding 2' })

          // Action & Assert
          return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow(
            new DeleteThreadComment({ commentId: 'thread_comment-1', threadId: 'thread-1' }), 'user-2'))
            .rejects
            .toThrowError(AuthorizationError)
        })

        it('should not throw when threadComment is same owner', async () => {
          // Action & Assert
          return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow(
            new DeleteThreadComment({ commentId: 'thread_comment-1', threadId: 'thread-1' }), 'user-1'))
            .resolves.not
            .toThrow(AuthorizationError)
        })
      })
    })

    describe('and with reply', () => {
      describe('and thread comment does not exist', () => {
        it('should throw NotFoundError when threadComment not found', () => {
          // Action & Assert
          return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow({ commentId: 'thread_comment-2', threadId: 'thread-1', replyId: 'thread_comment-1' }, 'user-1'))
            .rejects
            .toThrowError(NotFoundError)
        })
      })

      describe('and thread comment exist', () => {
        beforeEach(async () => {
          // Arrange
          await ThreadsTableTestHelper.addThread({
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            userId: 'user-1'
          })
          await ThreadCommentsTableTestHelper.addThreadComment({
            id: 'thread_comment-1',
            content: 'comment 1',
            userId: 'user-1',
            threadId: 'thread-1'
          })
          await ThreadCommentsTableTestHelper.addThreadComment({
            id: 'thread_comment-2',
            content: 'comment 2',
            userId: 'user-1',
            threadId: 'thread-1',
            commentId: 'thread_comment-1'
          })
        })

        it('should throw AuthorizationError when threadComment is different owner', async () => {
          // Arrange
          await UsersTableTestHelper.addUser({ id: 'user-2', username: 'dicoding 2', fullname: 'Dicoding 2' })

          // Action & Assert
          return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow(
            new DeleteThreadComment({ commentId: 'thread_comment-1', threadId: 'thread-1', replyId: 'thread_comment-2' }), 'user-2'))
            .rejects
            .toThrowError(AuthorizationError)
        })

        it('should not throw when threadComment is same owner', async () => {
          // Action & Assert
          return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow(
            new DeleteThreadComment({ commentId: 'thread_comment-1', threadId: 'thread-1', replyId: 'thread_comment-2' }), 'user-1'))
            .resolves.not
            .toThrow(AuthorizationError)
        })
      })
    })
  })

  describe('deleteThreadComment function', () => {
    let threadCommentRepositoryPostgres

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding', fullname: 'Dicoding 1' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        userId: 'user-1',
        threadId: 'thread-1'
      })
      threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
    })

    it('should soft delete threadComment from database', async () => {
      // Action
      await threadCommentRepositoryPostgres.deleteThreadComment(new DeleteThreadComment({ commentId: 'thread_comment-1', threadId: 'thread-1' }), 'user-1')

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadComment('thread_comment-1', 'thread-1', 'user-1')
      expect(threadComments).toHaveLength(1)
      expect(threadComments.soft_delete_at).not.toBeNull()
    })

    it('should soft delete threadComment with reply from database', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-2',
        content: 'comment 1',
        userId: 'user-1',
        threadId: 'thread-1',
        commentId: 'thread_comment-1'
      })

      // Action
      await threadCommentRepositoryPostgres.deleteThreadComment(new DeleteThreadComment({ commentId: 'thread_comment-1', threadId: 'thread-1', replyId: 'thread_comment-2' }), 'user-1')

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadComment('thread_comment-1', 'thread-1', 'user-1', 'thread_comment-2')
      expect(threadComments).toHaveLength(1)
      expect(threadComments.soft_delete_at).not.toBeNull()
    })
  })
})
