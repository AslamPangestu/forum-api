/* eslint-disable camelcase */

const TABLE_NAME = 'threads'

exports.up = pgm => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    body: {
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
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable(TABLE_NAME)
}
