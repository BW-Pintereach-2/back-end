
exports.up = function(knex) {
  return knex.schema
  .createTable('Users', tbl => {
      tbl.increments('id')
      tbl.string('email', 255).notNullable().unique()
      tbl.string('username', 255).notNullable().unique()
      tbl.string('password', 255).notNullable()
  })
  .createTable('Articles', tbl => {
    tbl.increments('id')
    tbl.text('name', 255).notNullable().unique()
    tbl.text('article').notNullable()
    tbl.boolean('isSaved').defaultTo(false)
  })
  .createTable('Categories', tbl => {
    tbl.increments('id')
    tbl.string('name', 255).notNullable().unique()
  })
  .createTable('Article_Category', tbl => {
    tbl.increments('id')
    tbl.integer('category_id').unsigned().notNullable()
    .references('id')
    .inTable('Categories')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
    tbl.integer('article_id').unsigned().notNullable()
    .references('id')
    .inTable('Articles')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('Article_Category')
  .dropTableIfExists('Categories')
  .dropTableIfExists('Articles')
  .dropTableIfExists('Users')
};
