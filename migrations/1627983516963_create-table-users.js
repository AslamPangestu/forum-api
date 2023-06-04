const TABLE_NAME = 'users'

exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    },
    fullname: {
      type: 'TEXT',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true
    },
    updated_at: {
      type: 'timestamp',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME)
}
