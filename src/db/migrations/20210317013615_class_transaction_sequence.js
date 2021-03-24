const sequenceName = 'class_transaction_seq';

exports.up = async (knex) => {
    knex.raw(`CREATE SEQUENCE ${sequenceName} START 111249294`);
};

exports.down = function(knex) {
    knex.raw(`DROP SEQUENCE IF EXISTS ${sequenceName}`);
};