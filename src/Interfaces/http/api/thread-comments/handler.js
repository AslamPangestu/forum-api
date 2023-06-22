const AddThreadCommentUseCase = require('../../../../Applications/use_case/thread_comments/AddThreadCommentUseCase')
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/thread_comments/DeleteThreadCommentUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this)
    this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this)
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this)
  }

  async postThreadCommentHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name)
    const addedComment = await addThreadCommentUseCase.execute({
      ...request.payload,
      ...request.params
    }, credentialId)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async postThreadCommentReplyHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name)
    const addedReply = await addThreadCommentUseCase.execute({
      ...request.payload,
      ...request.params
    }, credentialId)

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteThreadCommentHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name)
    await deleteThreadCommentUseCase.execute(request.params, credentialId)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
