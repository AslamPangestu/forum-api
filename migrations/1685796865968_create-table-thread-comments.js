/* eslint-disable camelcase */

const TABLE_NAME = 'thread_comments'

exports.up = pgm => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'VARCHAR(255)',
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
    soft_delete_at: {
      type: 'timestamp'
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      notNull: true
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: '"threads"',
      notNull: true
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: '"thread_comments"'
    }
  })
  pgm.createIndex(TABLE_NAME, 'user_id')
  pgm.createIndex(TABLE_NAME, 'thread_id')
  pgm.createIndex(TABLE_NAME, 'comment_id')
}

exports.down = pgm => {
  pgm.dropTable(TABLE_NAME)
}
