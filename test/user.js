module.exports = (chai, httpServer, expect) => {
  
  describe('GET /api/v1/user', () => {
    it('Should return a list of users based on ecompany Id', async () => {
      const login = await chai.request(httpServer)
      .post('/api/v1/user-login')
      .send({ 
        email: 'nawakaraadmin@nawakara.com', 
        password: 'emtivnawakaraadmin' 
      });

      const res = await chai.request(httpServer)
      .get('/api/v1/user/1')
      .set('authorization', login.body.data)
      .send();
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
    });
  });

  describe('GET /api/v1/user-import-template', () => {
    it('Should return file with correct content', async () => {
      const res = await chai.request(httpServer)
      .get('/api/v1/user-import-template')
      .send();

      expect(res.status).to.equal(200);
      expect(res.header['content-type']).to.equal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(res.header['content-disposition']).to.equal('attachment; filename="Import Data Karyawan Template.xlsx"');
    });
  });

  describe('DEL /api/v1/user', () => {
    it('Should return success message', async () => {
      const login = await chai.request(httpServer)
      .post('/api/v1/user-login')
      .send({
        email: 'nawakaraadmin@nawakara.com',
        password: 'emtivnawakaraadmin'
      });

      const res = await chai.request(httpServer)
      .delete('/api/v1/user/1')
      .set('authorization', login.body.data)
      .send();

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
    });
  });

  describe('PUT /api/v1/change-password', () => {
    it('Should return success', async () => {
      const login = await chai.request(httpServer)
      .post('/api/v1/user-login')
      .send({
        email: 'nawakarauser1@nawakara.com',
        password: 'emtivnawakarauser'
      });
      const res = await chai.request(httpServer)
      .put('/api/v1/user-change-password')
      .set('authorization', login.body.data)
      .send({
        newPassword: 'nawakarauserpassword'
      });
      const login2 = await chai.request(httpServer)
      .post('/api/v1/user-login')
      .send({
        email: 'nawakarauser1@nawakara.com',
        password: 'nawakarauserpassword'
      });

      expect(res.status).to.equal(200);
      expect(login2.status).to.equal(200);
      expect(login2.body.data).to.not.be.undefined;
    });
  });

}
