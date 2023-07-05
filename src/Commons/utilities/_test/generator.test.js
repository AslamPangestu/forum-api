const { generateId } = require('../generator')

describe('Generate data', () => {
  describe('generate random id', () => {
    it('should throw error when tabelName empty', () => {
      expect(() => generateId()).toThrowError('tableName required')
    })

    it('should create id with format [tableName-randomInteger] correctly', () => {
      const [tableName, randomInteger] = generateId('table_name').split('-')

      expect(tableName).toEqual('table_name')
      expect(randomInteger.length).toBeGreaterThan(0)
    })
  })
})
