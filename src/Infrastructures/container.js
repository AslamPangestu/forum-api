/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')

const { generateId } = require('../Commons/utilities/generator')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const IUserRepository = require('../Domains/users/IUserRepository')
const PasswordHash = require('../Applications/security/PasswordHash')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')

// use case
const AddUserUseCase = require('../Applications/use_case/authentications/AddUserUseCase')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase')
const IAuthenticationRepository = require('../Domains/authentications/IAuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
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
  {
    key: PasswordHash.name,
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
    key: AuthenticationTokenManager.name,
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
          internal: PasswordHash.name
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
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
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
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  }
])

module.exports = container
