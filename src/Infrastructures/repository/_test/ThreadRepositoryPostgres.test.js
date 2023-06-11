const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
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
    it('should persist thread and return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      const addThread = new AddThread({
        title: 'Tittle Thread',
        body: 'Body Thread'
      })
      const fakeIdGenerator = () => 'thread-1' // stub!
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)

      // Action
      await threadRepositoryPostgres.addThread(addThread, 'user-1')

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-1')
      expect(threads.length).toBeGreaterThan(0)
    })

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dicoding' })
      const addThread = new AddThread({
        title: 'Tittle Thread',
        body: 'Body Thread'
      })
      const fakeIdGenerator = () => 'thread-1' // stub!
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)

      // Action
      const threadId = await threadRepositoryPostgres.addThread(addThread, 'user-1')

      // Assert
      expect(threadId).toStrictEqual({ id: 'thread-1', title: 'Tittle Thread' })
    })
  })

  describe('getThreadById function', () => {
    it('should throw InvariantError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-1'))
        .rejects
        .toThrowError(InvariantError)
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
      const thread = await threadRepositoryPostgres.getThreadById('thread-1')
      expect(thread).toEqual(new GetThread([
        {
          id: 'thread-1',
          title: 'Tittle Thread',
          body: 'Body Thread',
          date: '2023-06-04T06:29:54.057Z',
          username: 'dicoding'
        }
      ]))
    })
  })
})
