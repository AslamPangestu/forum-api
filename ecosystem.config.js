module.exports = [{
  script: 'src/app.js',
  name: 'forum-api',
  exec_mode: 'cluster',
  instances: 2
}, {
  script: 'worker.js',
  name: 'worker'
}]
