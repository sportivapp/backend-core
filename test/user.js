const templatePath = require('../templates');

module.exports = (chai, httpServer, expect) => {
  
  describe('GET /api/v1/user-list', () => {
    it('Should return a list of users based on ecompany Id', async () => {
      const res = await chai.request(httpServer)
      .get('/api/v1/user-list')
      .send({
        ecompanyecompanyid: 1
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

  describe('GET /api/v1/user-import-template', () => {
    it('Should return correct file path', async () => {
      const res = await chai.request(httpServer)
      .post('/api/v1/user-import-template')
      .send();

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('path');
      expect(res.body.data.path).to.equal(templatePath);
    })
  })

}
