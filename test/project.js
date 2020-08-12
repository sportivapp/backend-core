module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/project', () => {
      it('Should return single project', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({
          email: 'nawakarapm@nawakara.com',
          password: 'emtivnawakarapm'
        });

        const requestBody = {
          code: '1A',
          name: 'SatuA',
          startDate: '2020-07-24',
          endDate: '2020-12-24'
        }

        const res = await chai.request(httpServer)
        .post('/api/v1/project')
        .set('authorization', login.body.data)
        .send(requestBody);
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
        expect(res.body.data.eprojectcode).to.equal(requestBody.code);
        expect(res.body.data.eprojectname).to.equal(requestBody.name);
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

        let page = 0
        let size = 10

        const res = await chai.request(httpServer)
        .get(`/api/v1/project?page=${page}&size=${size}`)
        .set('authorization', login.body.data)
        .send();

        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
        expect(res.body.paging).to.not.be.undefined;
        expect(res.body.paging.page).to.equal(page);
        expect(res.body.paging.size).to.equal(size);
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

        const requestBody = {
          code: '2A',
          name: 'DuaA',
          startDate: '2021-07-24',
          endDate: '2021-12-24',
          address: 'Test dua'
        };

        const res = await chai.request(httpServer)
        .put('/api/v1/project/1')
        .set('authorization', login.body.data)
        .send(requestBody);
  
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
        expect(res.body.data.eprojectid).to.not.be.undefined
        expect(res.body.data.eprojectcode).to.equal(requestBody.code)
        expect(res.body.data.eprojectname).to.equal(requestBody.name)
      });
    });

  describe('POST /api/v1/project/id/devices', () => {
    it('Should return device list of 1 project', async () => {
      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      let id = 1

      const request = {
        deviceIds: [1]
      }

      const res = await chai.request(httpServer)
          .post(`/api/v1/project/${id}/devices`)
          .set('authorization', login.body.data)
          .send(request)

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.data.length).to.greaterThan(0)
    });
  });

  describe('GET /api/v1/project/id/devices', () => {
    it('Should return device list of 1 project', async () => {
      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      let id = 1

      let page = 0
      let size = 10

      const res = await chai.request(httpServer)
          .get(`/api/v1/project/${id}/devices?page=${page}&size=${size}`)
          .set('authorization', login.body.data)
          .send()

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
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