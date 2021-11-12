Knex migrate does not create these sequences, so you should manually 

CREATE SEQUENCE class_transaction_seq START 1
CREATE SEQUENCE class_complaint_seq START 1

If you make a new Database.