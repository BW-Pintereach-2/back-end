
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('Categories').insert([
        {name: 'Technology'},
        {name: 'Art'},
        {name: 'Finances'},
        {name: 'Fiction'},
        {name: 'Automotive'},
        {name: 'Science'},
      ]);
    });
};
