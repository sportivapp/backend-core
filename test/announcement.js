module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/announcement', () => {
      it('Should return single announcement', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .post('/api/v1/announcement')
        .set('authorization', login.body.data)
        .send({
            announcementTitle: 'Nawakara project',
            announcementContent: 'Nawakara first project',
            userIds: [1,2,3]
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('GET /api/v1/announcement', () => {
      it('Should return a single announcement by id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
            email: 'nawakarauser2@nawakara.com',
            password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .get('/api/v1/announcement/1')
        .set('authorization', login.body.data)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('GET /api/v1/announcement-list', () => {
        it('Should return announcement list', async () => {
          const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakarauser2@nawakara.com',
            password: 'emtivnawakarauser'
          });
    
          const res = await chai.request(httpServer)
          .get('/api/v1/announcement-list')
          .set('authorization', login.body.data)
          .send();
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
  
    describe('PUT /api/v1/announcement', () => {
      it('Should return success update message', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/announcement/1')
        .set('authorization', login.body.data)
        .send({
          announcementTitle: 'test1',
          announcementContent: 'tes tes tes',
          userIds: [3]
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('PUT /api/v1/announcement-delete', () => {
      it('Should return success delete message', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/announcement-delete/1')
        .set('authorization', login.body.data)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  }