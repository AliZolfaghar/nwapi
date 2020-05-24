
exports.up = function(knex) {
    return knex.schema.createTable('tbl_users',(table)=>{
        table.increments('userid');
        table.string('username');
        table.string('password');
        table.string('realname');
        table.string('email');
        table.string('cellphone');
        table.boolean('isactive');    
      });  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tbl_users'); 
};
