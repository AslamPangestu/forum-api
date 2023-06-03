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
      references: '"users"'
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: '"threads"'
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: '"comments"'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable(TABLE_NAME)
}
