const ThreadCommentsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'thread-comments',
  register: async (server, { container }) => {
    const threadComments = new ThreadCommentsHandler(container)
    server.route(routes(threadComments))
  }
}
