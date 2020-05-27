
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Article_Category').del()
    .then(function () {
      // Inserts seed entries
      return knex('Article_Category').insert([
        {id: 1, article_id: 1, category_id:1},
      ]);
    });
};
