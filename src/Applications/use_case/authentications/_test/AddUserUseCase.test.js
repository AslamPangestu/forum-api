const RegisterUser = require('../../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser')
const IUserRepository = require('../../../../Domains/users/IUserRepository')
const IPasswordHash = require('../../../security/IPasswordHash')
const AddUserUseCase = require('../AddUserUseCase')

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-1',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })

    /** creating dependency of use case */
    const mockUserRepository = new IUserRepository()
    const mockPasswordHash = new IPasswordHash()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser))

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-1',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    }))

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname
    }))
  })
})
