const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const GetThread = require('../../../Domains/threads/entities/GetThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addUser function', () => {
    it('should persist thread and return thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '123' // stub!
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)

      // Action
      await threadRepositoryPostgres.addThread(addThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-1')
      expect(threads.length).toBeGreaterThan(0)
    })

    it('should return thread_id correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '123' // stub!
      const fakeCurrentDateGenerator = () => '2023-06-04T13:29:54.057Z' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeCurrentDateGenerator)

      // Action
      const threadId = await threadRepositoryPostgres.addThread(addThread)

      // Assert
      expect(threadId).toStrictEqual('thread-1')
    })
  })

  describe('getThreadById function', () => {
    it('should throw InvariantError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-2'))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return thread data when thread is found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        currentDate: '2023-06-04T13:29:54.057Z',
        userId: 'user-1'
      })

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {})

      // Action & Assert
      const thread = await threadRepositoryPostgres.getThreadById('thread-1')
      expect(thread).toEqual(new GetThread([
        {
          id: 'thread-1',
          title: 'dicoding',
          body: 'Dicoding Indonesia',
          created_at: '2023-06-04T13:29:54.057Z',
          username: 'Username 1'
        }
      ]))
    })
  })
})
