process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { httpServer } = require('../src');
const knex = require('../src/db/config');
const { expect } = require('chai');

describe('Routes: users', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  // describe('POST /user', () => {
  //   it('Should return single user after insert', async () => {
  //       const res = await chai.request(httpServer)
  //       .post('/api/v1/user')
  //       .send({ 
  //         nik: 1111111111, 
  //         name: 'satu', 
  //         email: 'satu@satu.com', 
  //         password: 'satu', 
  //         mobileNumber: '1111111111' 
  //       });

  //       expect(res.status).to.equal(200);
  //       expect(res.body.data).to.not.be.undefined;
  //   });
  // });

  describe('POST /api/v1/company', () => {
    it('Should return single result of user, company and address after insert', async () => {
      const res = await chai.request(httpServer)
      .post('/api/v1/company')
      .send({
        nik: 123456789,
        name: 'nawakaraadmin', 
        email: 'nawakaraadmin@nawakara.com', 
        password: 'emtivnawakaraadmin', 
        mobileNumber: '987654321',
        companyName: 'PT. Nawakara Perkasa Nusantara',
        companyEmail: '@nawakara.com',
        street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
        postalCode: 12420
      });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
    });
  });

  describe('POST /api/v1/user-login', () => {
    it('Should return jwt token after successful login', async () => {
      const res = await chai.request(httpServer)
      .post('/api/v1/user-login')
      .send({ 
        email: 'nawakaraadmin@nawakara.com', 
        password: 'emtivnawakaraadmin' 
      });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
      expect(res.body.data).to.have.property('token');
    });
  });

});