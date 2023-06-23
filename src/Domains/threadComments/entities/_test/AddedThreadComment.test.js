const AddedThreadComment = require('../AddedThreadComment')

describe('a AddedThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sfsdf ds fs'
    }

    // Action and Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      id: 123,
      owner: true
    }

    // Action and Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addedComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment 1',
      id: 'thread_comment-1',
      owner: 'fdsfd dsf'
    }

    // Action
    const addedComment = new AddedThreadComment(payload)

    // Assert
    expect(addedComment).toBeInstanceOf(AddedThreadComment)
    expect(addedComment.content).toEqual(payload.content)
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.owner).toEqual(payload.owner)
  })
})
