process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { httpServer } = require('../src');
const knex = require('../src/db/config');

describe('Routes: users', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /users', () => {
    test('Should return single user after insert', async () => {
        const res = await chai.request(httpServer)
        .post('/api/v1/users')
        .send({ nik: 1111111111, name: 'satu', email: 'satu@satu.com', password: 'satu', mobileNumber: '1111111111' });

        expect(res.status).toEqual(200);
        expect(res.body.data).toBeDefined();
    });
  });

});