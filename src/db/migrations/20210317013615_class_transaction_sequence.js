const sequenceName = 'class_transaction_seq';

exports.up = async (knex, Promise) => {
    knex.raw(`CREATE SEQUENCE ${sequenceName} START 1`);
};

exports.down = function(knex, Promise) {
    knex.raw(`DROP SEQUENCE IF EXISTS ${sequenceName}`);
};