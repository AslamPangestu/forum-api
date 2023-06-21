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
    it('should persist threadComment and return threadComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        userId: 'user-1'
      })
      const addThreadComment = new AddThreadComment({
        content: 'comment 1',
        thread_id: 'thread-1'
      })
      const fakeIdGenerator = () => 'thread_comment-1' // stub!
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)

      // Action
      await threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1')

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadComment('thread_comment-1', 'thread-1', 'user-1')
      expect(threadComments.length).toBeGreaterThan(0)
    })

    it('should return threadComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        userId: 'user-1'
      })
      const addThreadComment = new AddThreadComment({
        content: 'comment 1',
        thread_id: 'thread-1'
      })
      const fakeIdGenerator = () => 'thread_comment-1' // stub!
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)

      // Action
      const threadComment = await threadCommentRepositoryPostgres.addThreadComment(addThreadComment, 'user-1')

      // Assert
      expect(threadComment).toStrictEqual({ id: 'thread_comment-1', content: 'comment 1' })
    })
  })

  describe('checkThreadCommentAllow function', () => {
    it('should throw NotFoundError when threadComment not found', () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow({ commentId: 'thread_comment-1', threadId: 'thread-1' }, 'user-1'))
        .rejects
        .toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when threadComment is different owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding', fullname: 'Dicoding 1' })
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'dicoding 2', fullname: 'Dicoding 2' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        currentDate: '2023-06-04T13:29:54.057Z',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        userId: 'user-1',
        threadId: 'thread-1'
      })
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {}, {})

      // Action & Assert
      return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow(
        new DeleteThreadComment({ comment_id: 'thread_comment-1', thread_id: 'thread-1' }), 'user-2'))
        .rejects
        .toThrowError(AuthorizationError)
    })

    it('should not throw when threadComment is same owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding', fullname: 'Dicoding 1' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        currentDate: '2023-06-04T13:29:54.057Z',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        userId: 'user-1',
        threadId: 'thread-1'
      })
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {}, {})

      // Action & Assert
      return expect(threadCommentRepositoryPostgres.checkThreadCommentAllow(
        new DeleteThreadComment({ comment_id: 'thread_comment-1', thread_id: 'thread-1' }), 'user-1'))
        .resolves.not
        .toThrow(AuthorizationError)
    })
  })

  describe('deleteThreadComment function', () => {
    it('should soft delete threadComment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding', fullname: 'Dicoding 1' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        currentDate: '2023-06-04T13:29:54.057Z',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        userId: 'user-1',
        threadId: 'thread-1'
      })
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {}, fakeCurrentDateGenerator)

      // Action
      await threadCommentRepositoryPostgres.deleteThreadComment(new DeleteThreadComment({ comment_id: 'thread_comment-1', thread_id: 'thread-1' }), 'user-1')

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadComment('thread_comment-1', 'thread-1', 'user-1')
      expect(threadComments).toHaveLength(0)
    })
  })
})
