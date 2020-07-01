exports.up = function(knex) {
    return knex.schema.createTable('tbl_users',(table)=>{
        table.increments('userid');
        table.string('username');
        table.string('password');
        table.string('realname');
        table.string('email');
        table.string('cellphone');
        table.boolean('isactive');    
        table.integer('roleid').references('roleid').inTable('tbl_roles');
      });  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tbl_users'); 
};
