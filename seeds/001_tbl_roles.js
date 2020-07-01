exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tbl_roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('tbl_roles').insert([
        {roleid: 1, rolename: 'admin'},
        {roleid: 2, rolename: 'user'},
        {roleid: 3, rolename: 'guest'}
      ]);
    });
};
