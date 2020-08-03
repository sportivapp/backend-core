module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/roster', () => {
      it('Should return single roster', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .post('/api/v1/roster')
        .set('authorization', login.body.data)
        .send({
            rosterName: 'test1',
            rosterDescription: 'this is test1',
            projectId: 1,
            userIds: [1,2,3]
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('GET /api/v1/roster', () => {
      it('Should return a single roster by id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .get('/api/v1/roster/1')
        .set('authorization', login.body.data)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('GET /api/v1/roster-members', () => {
        it('Should return a single roster by id', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakarapm@nawakara.com',
            password: 'emtivnawakarapm'
          });
    
          const res = await chai.request(httpServer)
          .get('/api/v1/roster-members/1')
          .set('authorization', login.body.data)
          .send();
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });

      describe('GET /api/v1/roster', () => {
        it('Should return a list of roste', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakarapm@nawakara.com',
            password: 'emtivnawakarapm'
          });
    
          const res = await chai.request(httpServer)
          .get('/api/v1/roster')
          .set('authorization', login.body.data)
          .send();
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
  
    describe('PUT /api/v1/roster', () => {
      it('Should return single updated roster id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/roster/1')
        .set('authorization', login.body.data)
        .send({
          rosterId: 1,
          rosterName: 'test1',
          rosterDescription: 'this is test1',
          projectId: 1,
          userIds: [3]
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('DEL /api/v1/roster', () => {
      it('Should return single deleted roster id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .delete('/api/v1/roster/1')
        .set('authorization', login.body.data)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  }