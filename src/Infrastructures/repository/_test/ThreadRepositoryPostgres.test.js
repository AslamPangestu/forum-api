const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

const AddThread = require('../../../Domains/threads/entities/AddThread')
const GetThread = require('../../../Domains/threads/entities/GetThread')

const pool = require('../../database/postgres/pool')

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    let addThread, threadRepositoryPostgres

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      addThread = new AddThread({
        title: 'Tittle Thread',
        body: 'Body Thread'
      })
      const fakeIdGenerator = () => 'thread-1' // stub!
      threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
    })

    it('should persist thread and return thread correctly', async () => {
      // Action
      await threadRepositoryPostgres.addThread(addThread, 'user-1')

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-1')
      expect(threads.length).toBeGreaterThan(0)
    })

    it('should return thread correctly', async () => {
      // Action
      const thread = await threadRepositoryPostgres.addThread(addThread, 'user-1')

      // Assert
      expect(thread).toStrictEqual({ id: 'thread-1', title: 'Tittle Thread' })
    })
  })

  describe('findThreadById function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {})

      // Action & Assert
      return expect(threadRepositoryPostgres.findThreadById('thread-1'))
        .rejects
        .toThrowError(NotFoundError)
    })

    describe('thread found', () => {
      let threadRepositoryPostgres

      beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
        await ThreadsTableTestHelper.addThread({
          id: 'thread-1',
          title: 'Tittle Thread',
          body: 'Body Thread',
          userId: 'user-1'
        })

        threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {})
      })

      it('should return thread data', async () => {
        // Action & Assert
        const thread = await threadRepositoryPostgres.findThreadById('thread-1')
        expect(thread).toEqual(new GetThread([
          {
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            created_at: thread.date,
            username: 'dicoding',
            comment_id: null,
            comment_content: null,
            comment_username: null,
            comment_at: null,
            like_count: 0
          }
        ]))
      })

      it('should return thread data with comment when have comment', async () => {
        // Arrange
        await ThreadCommentsTableTestHelper.addThreadComment({
          id: 'thread_comment-1',
          content: 'comment 1',
          userId: 'user-1',
          threadId: 'thread-1'
        })
        await ThreadCommentsTableTestHelper.addThreadComment({
          id: 'thread_comment-2',
          content: 'comment 1',
          userId: 'user-1',
          threadId: 'thread-1',
          commentId: 'thread_comment-1'
        })
        await ThreadCommentLikesTableTestHelper.addThreadCommentLike({ id: 'thread_comment_like-1', commentId: 'thread_comment-1', userId: 'user-1' })

        // Action & Assert
        const thread = await threadRepositoryPostgres.findThreadById('thread-1')
        expect(thread).toEqual(new GetThread([
          {
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            created_at: thread.date,
            username: 'dicoding',
            comment_id: null,
            comment_content: null,
            comment_at: null,
            comment_username: null,
            comment_delete_at: null,
            reply_id: null,
            like_count: 0
          },
          {
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            created_at: thread.date,
            username: 'dicoding',
            comment_id: 'thread_comment-1',
            comment_content: 'comment 1',
            comment_username: 'dicoding',
            comment_at: thread.comments[0].date,
            reply_id: null,
            like_count: 1
          },
          {
            id: 'thread-1',
            title: 'Tittle Thread',
            body: 'Body Thread',
            created_at: thread.date,
            username: 'dicoding',
            comment_id: 'thread_comment-2',
            comment_content: 'comment 1',
            comment_username: 'dicoding',
            comment_at: thread.comments[0].replies[0].date,
            reply_id: 'thread_comment-1',
            like_count: 0
          }
        ]))
      })
    })
  })

  describe('checkThreadExist function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {})

      // Action & Assert
      return expect(threadRepositoryPostgres.checkThreadExist('thread-1'))
        .rejects
        .toThrowError(NotFoundError)
    })

    describe('thread found', () => {
      let threadRepositoryPostgres

      beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
        await ThreadsTableTestHelper.addThread({
          id: 'thread-1',
          title: 'Tittle Thread',
          body: 'Body Thread',
          userId: 'user-1'
        })

        threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {})
      })

      it('should not throw NotFoundError when thread found', async () => {
        // Action & Assert
        return expect(threadRepositoryPostgres.checkThreadExist('thread-1')).resolves.not
          .toThrow(NotFoundError)
      })
    })
  })
})
