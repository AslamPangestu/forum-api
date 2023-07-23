const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const LikeDislikeThreadComment = require('../../../Domains/threadComments/entities/LikeDislikeThreadComment')

const pool = require('../../database/postgres/pool')

const ThreadCommentLikeRepositoryPostgres = require('../ThreadCommentLikeRepositoryPostgres')

describe('ThreadCommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentLikesTableTestHelper.cleanTable()
    await ThreadCommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThreadCommentLike function', () => {
    let threadCommentLikeRepositoryPostgres, addThreadCommentLike

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      const fakeIdGenerator = () => 'thread_comment_like-1' // stub!
      threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator)
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        threadId: 'thread-1',
        userId: 'user-1'
      })
      addThreadCommentLike = new LikeDislikeThreadComment({
        commentId: 'thread_comment-1',
        userId: 'user-1'
      })
    })

    it('should persist threadCommentLike and return threadCommentLike correctly', async () => {
      // Action
      await threadCommentLikeRepositoryPostgres.addThreadCommentLike(addThreadCommentLike)

      // Assert
      const threadComments = await ThreadCommentLikesTableTestHelper.findThreadCommentLike('thread_comment_like-1', 'user-1', 'thread_comment-1')
      expect(threadComments.length).toBeGreaterThan(0)
    })

    it('should return threadCommentLike correctly', async () => {
      // Action
      const threadCommentLike = await threadCommentLikeRepositoryPostgres.addThreadCommentLike(addThreadCommentLike, 'user-1')

      // Assert
      expect(threadCommentLike).toStrictEqual({ id: 'thread_comment_like-1' })
    })
  })

  describe('findThreadCommentLike function', () => {
    let threadCommentLikeRepositoryPostgres

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      const fakeIdGenerator = () => 'thread_comment_like-1' // stub!
      threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator)
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        threadId: 'thread-1',
        userId: 'user-1'
      })
    })

    describe('and thread comment like does not exist', () => {
      it('should return null when threadComment not found', () => {
        // Action & Assert
        return expect(threadCommentLikeRepositoryPostgres.findThreadCommentLike({ commentId: 'thread_comment-1', userId: 'user-1' })).toBeNull()
      })
    })

    describe('and thread comment like exist', () => {
      beforeEach(async () => {
        // Arrange
        await ThreadCommentLikesTableTestHelper.addThreadCommentLike({
          id: 'thread_comment_like-1',
          commentId: 'thread_comment-1',
          userId: 'user-1'
        })
      })

      it('should not return null when found', async () => {
        // Action & Assert
        return expect(threadCommentLikeRepositoryPostgres.findThreadCommentLike(
          { commentId: 'thread_comment-1', userId: 'user-1' }))
          .not.toBeNull()
      })
    })
  })

  describe('updateThreadCommentLike function', () => {
    let threadCommentLikeRepositoryPostgres

    beforeEach(async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      const fakeIdGenerator = () => 'thread_comment_like-1' // stub!
      threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator)
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        userId: 'user-1'
      })
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'thread_comment-1',
        content: 'comment 1',
        threadId: 'thread-1',
        userId: 'user-1'
      })
      await ThreadCommentLikesTableTestHelper.addThreadCommentLike({
        id: 'thread_comment_like-1',
        commentId: 'thread_comment-1',
        userId: 'user-1'
      })
    })

    it('should update like data', async () => {
      // Action
      await threadCommentLikeRepositoryPostgres.updateThreadCommentLike({ id: 'thread_comment_like-1', like_status: 0 }, new LikeDislikeThreadComment({
        commentId: 'thread_comment-1',
        userId: 'user-1'
      }))

      // Assert
      const threadComments = await ThreadCommentLikesTableTestHelper.findThreadCommentLike('thread_comment_like-1', 'user-1', 'thread_comment-1')
      expect(threadComments).toHaveLength(1)
      expect(threadComments.like_status).toBe(1)
    })
  })
})
