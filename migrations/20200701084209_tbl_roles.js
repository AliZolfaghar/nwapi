exports.up = function(knex) {
    return knex.schema.createTable('tbl_roles',(table)=>{
        table.increments('roleid');
        table.string('rolename');
      });  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tbl_roles'); 
};
