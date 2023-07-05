const { nanoid } = require('nanoid')

const generateId = (tableName) => {
  if (!tableName) {
    throw new Error('tableName required')
  }
  return `${tableName}-${nanoid(16)}`
}

module.exports = { generateId }
