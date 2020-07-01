exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('tbl_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('tbl_users').insert([{
        userid: 1,
        username: 'admin',
        password: '123',
        realname: 'مدیر سیستم',
        email: 'azolfaghar@gmail.com',
        cellphone: '09121268912' , 
        isactive:true,
        roleid:1
      }]);
    });
};
