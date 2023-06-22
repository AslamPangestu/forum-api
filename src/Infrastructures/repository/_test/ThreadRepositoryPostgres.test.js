const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

const AddThread = require('../../../Domains/threads/entities/AddThread')
const GetThread = require('../../../Domains/threads/entities/GetThread')

const pool = require('../../database/postgres/pool')

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
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
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)
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

    it('should return thread data when thread is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'Tittle Thread',
        body: 'Body Thread',
        currentDate: '2023-06-04T13:29:54.057Z',
        userId: 'user-1'
      })

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {})

      // Action & Assert
      const thread = await threadRepositoryPostgres.findThreadById('thread-1')
      expect(thread).toEqual(new GetThread([
        {
          id: 'thread-1',
          title: 'Tittle Thread',
          body: 'Body Thread',
          date: '2023-06-04T06:29:54.057Z',
          username: 'dicoding',
          comment_id: null,
          comment_content: null,
          comment_username: null,
          comment_at: null
        }
      ]))
    })
  })
})
