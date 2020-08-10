
module.exports = (chai, httpServer, expect) => {

    describe('POST /api/v1/department', () => {
        it('Should return single department', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          });
    
          const res = await chai.request(httpServer)
          .post('/api/v1/department')
          .set('authorization', login.body.data)
          .send({
              departmentName: 'Sales Department',
              departmentDescription: 'Consist of Sales',
              companyId: 1
          });
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
    
      describe('GET /api/v1/department', () => {
        it('Should return a single department by id', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
              email: 'nawakaraadmin@nawakara.com',
              password: 'emtivnawakaraadmin'
          });

          const res = await chai.request(httpServer)
          .get('/api/v1/department?page=0&size=2&companyId=1')
          .set('authorization', login.body.data)
          .send();
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
  
      describe('PUT /api/v1/department', () => {
        it('Should return success update message', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          });
    
          const res = await chai.request(httpServer)
          .put('/api/v1/department/2')
          .set('authorization', login.body.data)
          .send({
              departmentName: 'Sub Sales Department',
              departmentDescription: 'Consist of Sales T0',
              departmentSuperiorId: 1,
              companyId: 1
          });
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
    
      describe('DEL /api/v1/department', () => {
        it('Should return success delete message', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          });
    
          const res = await chai.request(httpServer)
          .del('/api/v1/department/4?companyId=1')
          .set('authorization', login.body.data)
          .send();
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
}