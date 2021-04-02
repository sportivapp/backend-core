const sequenceName = 'class_complaint_seq';

exports.up = async (knex) => {
    knex.raw(`CREATE SEQUENCE ${sequenceName} START 1`);
};

exports.down = function(knex) {
    knex.raw(`DROP SEQUENCE IF EXISTS ${sequenceName}`);
};