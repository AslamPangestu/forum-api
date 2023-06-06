const IUserRepository = require('../../../../Domains/users/IUserRepository')
const IAuthenticationRepository = require('../../../../Domains/authentications/IAuthenticationRepository')
const IAuthenticationTokenManager = require('../../../security/IAuthenticationTokenManager')
const IPasswordHash = require('../../../security/IPasswordHash')
const LoginUserUseCase = require('../LoginUserUseCase')
const NewAuth = require('../../../../Domains/authentications/entities/NewAuth')

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret'
    }
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    const mockUserRepository = new IUserRepository()
    const mockAuthenticationRepository = new IAuthenticationRepository()
    const mockAuthenticationTokenManager = new IAuthenticationTokenManager()
    const mockPasswordHash = new IPasswordHash()

    // Mocking
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken))
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken))
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-1'))
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash
    })

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    }))
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding')
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith('secret', 'encrypted_password')
    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith('dicoding')
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-1' })
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-1' })
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(mockedAuthentication.refreshToken)
  })
})
