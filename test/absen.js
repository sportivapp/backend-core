module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/absen', () => {
      it('Should return single absen', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarauser1@nawakara.com',
          password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .post('/api/v1/absen')
        .set('authorization', login.body.data.token)
        .send({
            locationAccuracy: '100',
            absenStatus: 'Sakit',
            absenDescription: 'Sakit demam, pusing'
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('GET /api/v1/absen-list', () => {
      it('Should return list of absen by user id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
            email: 'nawakarauser1@nawakara.com',
            password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .get('/api/v1/absen-list/4')
        .set('authorization', login.body.data.token)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('PUT /api/v1/absen', () => {
      it('Should return success update message', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
            email: 'nawakarauser1@nawakara.com',
            password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/absen/1')
        .set('authorization', login.body.data.token)
        .send({
            eabsenlocationdistanceaccuracy: '95',
            eabsenstatus: 'Hadir',
            eabsendescription: 'Hadir dengan sehat',
            eabseneditby: 5,
            eabsenedittime: new Date(Date.now())
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('PUT /api/v1/absen-delete', () => {
      it('Should return success delete message', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
            email: 'nawakarauser1@nawakara.com',
            password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/absen-delete/2')
        .set('authorization', login.body.data.token)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  }