module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/project', () => {
      it('Should return single project', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });

        const res = await chai.request(httpServer)
        .post('/api/v1/project')
        .set('authorization', login.body.data)
        .send({
          code: '1A',
          name: 'SatuA',
          startDate: '2020-07-24',
          endDate: '2020-12-24'
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('GET /api/v1/project', () => {
      it('Should return a list of projects based on project manager user id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });

        const res = await chai.request(httpServer)
        .get('/api/v1/project')
        .set('authorization', login.body.data)
        .send();

        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('PUT /api/v1/project', () => {
      it('Should return single updated project id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });

        const res = await chai.request(httpServer)
        .put('/api/v1/project/1')
        .set('authorization', login.body.data)
        .send({
          code: '2A',
          name: 'DuaA',
          startDate: '2021-07-24',
          endDate: '2021-12-24',
          address: 'Test dua'
        });
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('DEL /api/v1/project', () => {
      it('Should return single deleted project id', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });

        const res = await chai.request(httpServer)
        .delete('/api/v1/project/2')
        .set('authorization', login.body.data)
        .send();
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });
}