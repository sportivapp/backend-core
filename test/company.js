module.exports = (chai, httpServer, expect) => {

    describe('POST /api/v1/company-register', () => {
        it('Should return single result of user, company and address after insert', async () => {

          const login = await chai.request(httpServer)
              .post('/api/v1/user-login')
              .send({
                email: 'nawakaraadmin@nawakara.com',
                password: 'emtivnawakaraadmin'
              })

          const res = await chai.request(httpServer)
          .post(`/api/v1/company-register`)
          .set('authorization', login.body.data)
          .send({
            nik: '123456789',
            name: 'nawakaraadmin',
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin',
            mobileNumber: '987654321',
            companyName: 'PT. Nawakara Perkasa Nusantara',
            companyEmail: '@nawakara.com',
            street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
            postalCode: 12420
          });

          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });

  describe('POST /api/v1/company', () => {
        it('Should return single result of user, company and address after insert', async () => {

          const login = await chai.request(httpServer)
              .post('/api/v1/user-login')
              .send({
                email: 'nawakaraadmin@nawakara.com',
                password: 'emtivnawakaraadmin'
              })

          const res = await chai.request(httpServer)
          .post(`/api/v1/company`)
          .set('authorization', login.body.data)
          .send({
            nik: '123456789',
            name: 'nawakaraadmin',
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin',
            mobileNumber: '987654321',
            companyName: 'PT. Nawakara Perkasa Nusantara',
            companyEmail: '@nawakara.com',
            street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
            postalCode: 12420,
            companyParentId: 1
          });

          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });

  describe('POST /api/v1/company/id/users', () => {
    it('Should return user list of 1 company', async () => {

      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      let id = 1

      const request = {
          users: [
              {
                  id: 5,
                  deleted: false
              }
          ]
      }

      const res = await chai.request(httpServer)
          .post(`/api/v1/company/${id}/users`)
          .set('authorization', login.body.data)
          .send(request)

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.data.length).to.equal(1)
    });
  });

  describe('PUT /api/v1/company', () => {
    it('Should return a single edited company', async () => {

      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      const res = await chai.request(httpServer)
          .put('/api/v1/company/1')
          .set('authorization', login.body.data)
          .send({
            companyName: 'PT. Nawakara Nusantara',
            companyEmail: 'nawakara@nawakara.com'
            // companyParentId: 1
          })

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
    });
  });

  describe('DEL /api/v1/company', () => {
    it('Should return a single soft deleted company', async () => {

      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      const res = await chai.request(httpServer)
          .delete('/api/v1/company/1')
          .set('authorization', login.body.data)
          .send()

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
    });
  });

  describe('GET /api/v1/company/id/users', () => {
    it('Should return user list of 1 company', async () => {

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
          .get(`/api/v1/company/${id}/users?page=${page}&size=${size}`)
          .set('authorization', login.body.data)
          .send()

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.paging).to.not.be.undefined
    });
  });

  describe('GET /api/v1/company', () => {
    it('Should return list of company based one type', async () => {

      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      let type = 'company'
      let keyword = ''

      let page = 0
      let size = 10

      const res = await chai.request(httpServer)
          .get(`/api/v1/company?page=${page}&&size=${size}&type=${type}&keyword=${keyword}`)
          .set('authorization', login.body.data)
          .send()

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.paging).to.not.be.undefined
    });
  });

  describe('POST /api/v1/company/id/users', () => {
    it('Should return user list of 1 company', async () => {

      const login = await chai.request(httpServer)
          .post('/api/v1/user-login')
          .send({
            email: 'nawakaraadmin@nawakara.com',
            password: 'emtivnawakaraadmin'
          })

      let id = 1

      const request = {
          users: [
              {
                  id: 5,
                  deleted: false
              },
              {
                  id: 4,
                  deleted: false
              }
          ]
      }

      const res = await chai.request(httpServer)
          .post(`/api/v1/company/${id}/users`)
          .set('authorization', login.body.data)
          .send(request)

      expect(res.status).to.equal(200)
      expect(res.body.data).to.not.be.undefined
      expect(res.body.data.length).to.equal(2)
    });
  });

  describe('POST /api/v1/company/id/users with deleted true', () => {
        it('Should return user list of 1 company', async () => {

            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            const request = {
                users: [
                    {
                        id: 5,
                        deleted: false
                    },
                    {
                        id: 4,
                        deleted: false
                    }
                ]
            }

            const res = await chai.request(httpServer)
                .post(`/api/v1/company/${id}/users`)
                .set('authorization', login.body.data)
                .send(request)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.length).to.equal(2)

            const newRequest = {
                users: [
                    {
                        id: 5,
                        deleted: false
                    },
                    {
                        id: 4,
                        deleted: true
                    }
                ]
            }

            const newRes = await chai.request(httpServer)
                .post(`/api/v1/company/${id}/users`)
                .set('authorization', login.body.data)
                .send(newRequest)

            expect(newRes.status).to.equal(200)
            expect(newRes.body.data).to.not.be.undefined
            expect(newRes.body.data.length).to.equal(1)
        });
    });

  // describe('GET /api/v1/company/id/users', () => {
  //   it('Should return user list of 1 company', async () => {
  //
  //     const login = await chai.request(httpServer)
  //         .post('/api/v1/user-login')
  //         .send({
  //           email: 'nawakaraadmin@nawakara.com',
  //           password: 'emtivnawakaraadmin'
  //         })
  //
  //     let id = 1
  //
  //     let page = 0
  //     let size = 10
  //
  //     const res = await chai.request(httpServer)
  //         .get(`/api/v1/company/${id}/users?page=${page}&size=${size}`)
  //         .set('authorization', login.body.data)
  //         .send()
  //
  //     expect(res.status).to.equal(200)
  //     expect(res.body.data).to.not.be.undefined
  //     expect(res.body.paging).to.not.be.undefined
  //   });
  // });
}