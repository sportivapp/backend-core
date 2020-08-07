module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/absen', () => {
      it('Should return single absen', async () => {

        const res = await chai.request(httpServer)
        .post('/api/v1/absen')
        .send({
            absenTime: 1577880000,
            imageFile: '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',
            deviceId: 1,
            userId: 4
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
            eabsenlocationdistanceaccuracy: '95',
            eabsenstatus: 'Hadir',
            eabsendescription: 'Hadir dengan sehat'
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
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