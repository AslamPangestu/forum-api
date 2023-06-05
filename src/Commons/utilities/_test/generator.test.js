const { generateCurrentDate, generateId } = require('../generator')

describe('Generate data', () => {
  describe('generate current data', () => {
    it('should create current data with iso format correctly', () => {
      const currentDate = generateCurrentDate()

      expect(new Date(currentDate).toString()).not.toEqual('Invalid Date')
    })
  })

  describe('generate random id', () => {
    it('should throw error when tabelName empty', () => {
      const [tableName] = generateId().split('-')

      expect(tableName).toEqual('')
    })

    it('should create id with format [tableName-randomInteger] correctly', () => {
      const [tableName, randomInteger] = generateId('table_name').split('-')

      expect(tableName).toEqual('table_name')
      expect(randomInteger).toHaveLength(16)
    })
  })
})
