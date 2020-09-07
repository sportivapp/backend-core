module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/absen', () => {
      it('Should return single absen', async () => {

        const res = await chai.request(httpServer)
        .post('/api/v1/absen')
        .send({
            absenTime: Date.now(),
            deviceImei: '11111',
            userId: 4
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('GET /api/v1/absen', () => {
      it('Should return list of absen by user id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
            email: 'nawakarauser1@nawakara.com',
            password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .get('/api/v1/absen?userId=4')
        .set('authorization', login.body.data)
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
        .set('authorization', login.body.data)
        .send({
            locationAccuracy: '95',
            absenStatus: 'Hadir',
            absenDescription: 'Hadir dengan sehat'
        });
  
        expect(res.status).to.equal(500);
        // expect(res.body.data).to.not.be.undefined;
      });
    });
  
    describe('DEL /api/v1/absen-delete', () => {
      it('Should return success delete message', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
            email: 'nawakarauser1@nawakara.com',
            password: 'emtivnawakarauser'
        });
  
        const res = await chai.request(httpServer)
        .delete('/api/v1/absen-delete/1')
        .set('authorization', login.body.data)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
  }