/* eslint-disable camelcase */

const TABLE_NAME = 'thread_comment_likes'

exports.up = pgm => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    like_status: {
      type: 'smallint',
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
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: '"thread_comments"'
    }
  })
  pgm.createIndex(TABLE_NAME, 'user_id')
  pgm.createIndex(TABLE_NAME, 'comment_id')
}

exports.down = pgm => {
  pgm.dropTable(TABLE_NAME)
}
