/* istanbul ignore file */
const { createContainer } = require('instances-container')

// external agency
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')

const { generateId, generateCurrentDate } = require('../Commons/utilities/generator')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const IPasswordHash = require('../Applications/security/IPasswordHash')
const IAuthenticationTokenManager = require('../Applications/security/IAuthenticationTokenManager')

const IAuthenticationRepository = require('../Domains/authentications/IAuthenticationRepository')
const IUserRepository = require('../Domains/users/IUserRepository')
const IThreadRepository = require('../Domains/threads/IThreadRepository')

const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')

const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const JwtTokenManager = require('./security/JwtTokenManager')

// use case
const AddUserUseCase = require('../Applications/use_case/authentications/AddUserUseCase')
const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase')
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase')

const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase')
const GetThreadUseCase = require('../Applications/use_case/threads/GetThreadUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  // REPOSITORY INTERFACE
  {
    key: IUserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: generateId
        },
        {
          concrete: generateCurrentDate
        }
      ]
    }
  },
  {
    key: IThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: generateId
        },
        {
          concrete: generateCurrentDate
        }
      ]
    }
  },
  {
    key: IAuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },

  // SERVICE
  {
    key: IPasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: IAuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  }
])

// registering use cases
container.register([
  // AUTH USE CASE
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: IUserRepository.name
        },
        {
          name: 'passwordHash',
          internal: IPasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: IUserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: IAuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: IAuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: IPasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: IAuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: IAuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: IAuthenticationTokenManager.name
        }
      ]
    }
  },

  // THREAD USE CASE
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: IThreadRepository.name
        }
      ]
    }
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: IThreadRepository.name
        }
      ]
    }
  }
])

module.exports = container
