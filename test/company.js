module.exports = (chai, httpServer, expect) => {

  // describe('POST /api/v1/company-register', () => {
  //       it('Should return single result of user, company and address after insert', async () => {
  //
  //         const login = await chai.request(httpServer)
  //             .post('/api/v1/user-login')
  //             .send({
  //               email: 'nawakaraadmin@nawakara.com',
  //               password: 'emtivnawakaraadmin'
  //             })
  //
  //         const res = await chai.request(httpServer)
  //         .post(`/api/v1/company-register`)
  //         .set('authorization', login.body.data)
  //         .send({
  //           nik: '123456789',
  //           name: 'nawakaraadmin',
  //           email: 'nawakaraadmin@nawakara.com',
  //           password: 'emtivnawakaraadmin',
  //           mobileNumber: '987654321',
  //           companyName: 'PT. Nawakara Perkasa Nusantara',
  //           companyEmail: '@nawakara.com',
  //           street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
  //           postalCode: 12420,
  //           countryId: 1,
  //           stateId: 1
  //         });
  //
  //         expect(res.status).to.equal(200);
  //         expect(res.body.data).to.not.be.undefined;
  //       });
  //     });

  // describe('POST /api/v1/company', () => {
  //       it('Should return single result of user, company and address after insert', async () => {
  //
  //         const login = await chai.request(httpServer)
  //             .post('/api/v1/user-login')
  //             .send({
  //               email: 'nawakaraadmin@nawakara.com',
  //               password: 'emtivnawakaraadmin'
  //             })
  //
  //         const res = await chai.request(httpServer)
  //         .post(`/api/v1/company`)
  //         .set('authorization', login.body.data)
  //         .send({
  //           supervisorId: 5,
  //           companyName: 'PT. Nawakara Perkasa Nusantara',
  //           companyEmail: '@nawakara.com',
  //           street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, ' +
  //               'Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
  //           postalCode: 12420,
  //           companyParentId: 1,
  //           companyOlderId: null,
  //           industryId: 2,
  //           countryId: 1,
  //           stateId: 2
  //         });
  //
  //         expect(res.status).to.equal(200);
  //         expect(res.body.data).to.not.be.undefined;
  //         expect(res.body.data.employeeCount).to.not.be.undefined
  //       });
  //     });

  describe('POST /api/v1/company with auto generate nik', () => {
        it('Should return single result of user, company and address after insert with auto generate nik', async () => {

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
                    supervisorId: 5,
                    companyName: 'PT. Nawakara Perkasa Nusantara',
                    companyEmail: '@nawakara.com',
                    street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, ' +
                        'Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
                    postalCode: 12420,
                    companyParentId: 1,
                    companyOlderId: null,
                    industryId: 2,
                    countryId: 1,
                    stateId: 2,
                    isAutoNik: true,
                    companyNik: 'NPN'
                });

            expect(res.status).to.equal(200);
            expect(res.body.data).to.not.be.undefined;
            expect(res.body.data.employeeCount).to.not.be.undefined
        });
    });

  // describe('PUT /api/v1/company', () => {
  //   it('Should return a single edited company', async () => {
  //
  //     const login = await chai.request(httpServer)
  //         .post('/api/v1/user-login')
  //         .send({
  //           email: 'nawakaraadmin@nawakara.com',
  //           password: 'emtivnawakaraadmin'
  //         })
  //
  //     const res = await chai.request(httpServer)
  //         .put('/api/v1/company/1')
  //         .set('authorization', login.body.data)
  //         .send({
  //           companyName: 'PT. Nawakara Nusantara',
  //           companyEmail: 'nawakara@nawakara.com',
  //           supervisorId: 1,
  //           street: 'Jalan Jalan',
  //           postalCode: 151231,
  //           countryId: 1,
  //           stateId: 1
  //         })
  //
  //     expect(res.status).to.equal(200)
  //     expect(res.body.data).to.not.be.undefined
  //   });
  // });

  // describe('DEL /api/v1/company', () => {
  //   it('Should return a single soft deleted company', async () => {
  //
  //     const login = await chai.request(httpServer)
  //         .post('/api/v1/user-login')
  //         .send({
  //           email: 'nawakaraadmin@nawakara.com',
  //           password: 'emtivnawakaraadmin'
  //         })
  //
  //     const res = await chai.request(httpServer)
  //         .delete('/api/v1/company/1')
  //         .set('authorization', login.body.data)
  //         .send()
  //
  //     expect(res.status).to.equal(200)
  //     expect(res.body.data).to.not.be.undefined
  //     expect(res.body.data).to.equal(true)
  //   });
  // });

  // describe('GET /api/v1/company', () => {
  //   it('Should return list of company based one type', async () => {
  //
  //     const login = await chai.request(httpServer)
  //         .post('/api/v1/user-login')
  //         .send({
  //           email: 'nawakaraadmin@nawakara.com',
  //           password: 'emtivnawakaraadmin'
  //         })
  //
  //     let type = 'SISTER'
  //     let companyId = 1
  //     let keyword = ''
  //
  //     let page = 0
  //     let size = 10
  //
  //     const res = await chai.request(httpServer)
  //         .get(`/api/v1/company?page=${page}&&size=${size}&type=${type}&keyword=${keyword}&companyId=${companyId}`)
  //         .set('authorization', login.body.data)
  //         .send()
  //
  //     expect(res.status).to.equal(200)
  //     expect(res.body.data).to.not.be.undefined
  //     expect(res.body.data.length).to.equal(1)
  //     expect(res.body.paging).to.not.be.undefined
  //   });
  // });

  // describe('GET /api/v1/company/id', () => {
  //       it('Should return 1 company', async () => {
  //
  //           const login = await chai.request(httpServer)
  //               .post('/api/v1/user-login')
  //               .send({
  //                   email: 'nawakaraadmin@nawakara.com',
  //                   password: 'emtivnawakaraadmin'
  //               })
  //
  //           let companyId = 1
  //
  //           const res = await chai.request(httpServer)
  //               .get(`/api/v1/company/${companyId}`)
  //               .set('authorization', login.body.data)
  //               .send()
  //
  //           expect(res.status).to.equal(200)
  //           expect(res.body.data).to.not.be.undefined
  //       });
  //   });

  // describe('GET /api/v1/company of logged in user with keyword', () => {
  //   it('Should return list of company by logged in userId', async () => {
  //
  //     const login = await chai.request(httpServer)
  //         .post('/api/v1/user-login')
  //         .send({
  //           email: 'nawakaraadmin@nawakara.com',
  //           password: 'emtivnawakaraadmin'
  //         })
  //
  //     const res = await chai.request(httpServer)
  //         .get('/api/v1/company?keyword=PT&page=0&size=10')
  //         .set('authorization', login.body.data)
  //         .send()
  //
  //     expect(res.status).to.equal(200)
  //     expect(res.body.data).to.not.be.undefined
  //     expect(res.body.data.length).to.greaterThan(0)
  //     expect(res.body.data[0].branches.length).to.greaterThan(0)
  //     expect(res.body.data[0].sisters.length).to.greaterThan(0)
  //   });
  // });

  // describe('POST /api/v1/company/id/users', () => {
  //   it('Should return user list consists of 8 data within 1 company', async () => {
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
  //     const request = {
  //         users: [
  //             {
  //                 id: 5,
  //                 deleted: false,
  //                 permission: 7
  //             },
  //             {
  //                 id: 4,
  //                 deleted: false,
  //                 permission: 9
  //             }
  //         ]
  //     }
  //
  //     const res = await chai.request(httpServer)
  //         .post(`/api/v1/company/${id}/users`)
  //         .set('authorization', login.body.data)
  //         .send(request)
  //
  //     expect(res.status).to.equal(200)
  //     expect(res.body.data).to.not.be.undefined
  //     expect(res.body.data.length).to.equal(8)
  //   });
  // });

  // describe('POST /api/v1/company/id/users with deleted true', () => {
  //       it('Should return user list consists of 2 data because of deleting 1 user within 1 company', async () => {
  //
  //           const login = await chai.request(httpServer)
  //               .post('/api/v1/user-login')
  //               .send({
  //                   email: 'nawakaraadmin@nawakara.com',
  //                   password: 'emtivnawakaraadmin'
  //               })
  //
  //           let id = 1
  //
  //           const request = {
  //               users: [
  //                   {
  //                       id: 5,
  //                       deleted: false,
  //                       permission: 7
  //                   }
  //               ]
  //           }
  //
  //           const res = await chai.request(httpServer)
  //               .post(`/api/v1/company/${id}/users`)
  //               .set('authorization', login.body.data)
  //               .send(request)
  //
  //           expect(res.status).to.equal(200)
  //           expect(res.body.data).to.not.be.undefined
  //           expect(res.body.data.length).to.equal(7)
  //
  //           const newRequest = {
  //               users: [
  //                   {
  //                       id: 5,
  //                       deleted: false,
  //                       permission: 7
  //                   },
  //                   {
  //                       id: 4,
  //                       deleted: true,
  //                       permission: 1
  //                   }
  //               ]
  //           }
  //
  //           const newRes = await chai.request(httpServer)
  //               .post(`/api/v1/company/${id}/users`)
  //               .set('authorization', login.body.data)
  //               .send(newRequest)
  //
  //           expect(newRes.status).to.equal(200)
  //           expect(newRes.body.data).to.not.be.undefined
  //           expect(newRes.body.data.length).to.equal(6)
  //       });
  //   });

  // describe('POST /api/v1/company/id/users with deleted true and then undelete user', () => {
  //       it('Should return user list consists of 3 data because of deleting 1 user then undelete 1 user within 1 company', async () => {
  //
  //           const login = await chai.request(httpServer)
  //               .post('/api/v1/user-login')
  //               .send({
  //                   email: 'nawakaraadmin@nawakara.com',
  //                   password: 'emtivnawakaraadmin'
  //               })
  //
  //           let id = 1
  //
  //           const request = {
  //               users: [
  //                   {
  //                       id: 5,
  //                       deleted: false,
  //                       permission: 7
  //                   },
  //                   {
  //                       id: 4,
  //                       deleted: false,
  //                       permission: 9
  //                   }
  //               ]
  //           }
  //
  //           const res = await chai.request(httpServer)
  //               .post(`/api/v1/company/${id}/users`)
  //               .set('authorization', login.body.data)
  //               .send(request)
  //
  //           expect(res.status).to.equal(200)
  //           expect(res.body.data).to.not.be.undefined
  //           expect(res.body.data.length).to.equal(8)
  //
  //           const newRequest = {
  //               users: [
  //                   {
  //                       id: 5,
  //                       deleted: false,
  //                       permission: 7
  //                   },
  //                   {
  //                       id: 4,
  //                       deleted: true,
  //                       permission: 9
  //                   }
  //               ]
  //           }
  //
  //           const newRes = await chai.request(httpServer)
  //               .post(`/api/v1/company/${id}/users`)
  //               .set('authorization', login.body.data)
  //               .send(newRequest)
  //
  //           expect(newRes.status).to.equal(200)
  //           expect(newRes.body.data).to.not.be.undefined
  //           expect(newRes.body.data.length).to.equal(7)
  //
  //           const anotherRequest = {
  //               users: [
  //                   {
  //                       id: 5,
  //                       deleted: false,
  //                       permission: 7
  //                   },
  //                   {
  //                       id: 4,
  //                       deleted: false,
  //                       permission: 9
  //                   }
  //               ]
  //           }
  //
  //           const anotherRes = await chai.request(httpServer)
  //               .post(`/api/v1/company/${id}/users`)
  //               .set('authorization', login.body.data)
  //               .send(anotherRequest)
  //
  //           expect(anotherRes.status).to.equal(200)
  //           expect(anotherRes.body.data).to.not.be.undefined
  //           expect(anotherRes.body.data.length).to.equal(8)
  //       });
  //   });

  // describe('GET /api/v1/company/id/users', () => {
  //       it('Should return user list of 1 company', async () => {
  //
  //           const login = await chai.request(httpServer)
  //               .post('/api/v1/user-login')
  //               .send({
  //                   email: 'nawakaraadmin@nawakara.com',
  //                   password: 'emtivnawakaraadmin'
  //               })
  //
  //           let id = 1
  //
  //           let page = 0
  //           let size = 10
  //
  //           const res = await chai.request(httpServer)
  //               .get(`/api/v1/company/${id}/users?page=${page}&size=${size}`)
  //               .set('authorization', login.body.data)
  //               .send()
  //
  //           expect(res.status).to.equal(200)
  //           expect(res.body.data).to.not.be.undefined
  //           expect(res.body.paging).to.not.be.undefined
  //       });
  //   });
}