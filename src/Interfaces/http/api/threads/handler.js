const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.getThreadHandler = this.getThreadHandler.bind(this)
  }

  async postThreadHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute(request.payload, credentialId)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getThreadHandler (request, h) {
    const gedThreadUseCase = this._container.getInstance(GetThreadUseCase.name)
    const thread = await gedThreadUseCase.execute(request.params)

    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })
    response.code(201)
    return response
  }
}

module.exports = ThreadsHandler
