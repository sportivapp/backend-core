module.exports = (chai, httpServer, expect) => {

    describe('POST /api/v1/grades-user-mapping', () => {
        it('Should return list of new grades data', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            expect(login.status).to.equal(200)
            expect(login.body).to.not.be.undefined

            const requestBody = {
                userId: 5,
                positionIds: [2,3]
            }


            const res = await chai.request(httpServer)
                .post(`/api/v1/grades-user-mapping`)
                .set('authorization', login.body.data)
                .send(requestBody)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
        });
    });

    describe('GET /api/v1/grades', () => {
        it('Should return grade list', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let page = 0
            let size = 10
            let companyId = 2

            const res = await chai.request(httpServer)
                .get(`/api/v1/grades?page=${page}&size=${size}&companyId=${companyId}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.paging).to.not.be.undefined
            expect(res.body.paging.page).to.equal(page)
            expect(res.body.paging.size).to.equal(size)
        });
    });

    describe('GET /api/v1/grades/id', () => {
        it('Should return a single grade by id', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            const res = await chai.request(httpServer)
                .get(`/api/v1/grades/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.egradename).to.not.be.undefined
        });
    });

    describe('PUT /api/v1/grades/id', () => {
        it('Should return success update message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                });

            let id = 1

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/grades/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data.egradename).to.not.be.undefined

            const requestBody = {
                description: `${getResponse.body.data.egradedescription} Edited`,
                name: getResponse.body.data.egradename
            }

            const res = await chai.request(httpServer)
                .put(`/api/v1/grades/${id}`)
                .set('authorization', login.body.data)
                .send(requestBody);

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.egradeid).to.not.be.undefined
            expect(res.body.data.egradedescription).to.equal(requestBody.description)
            expect(res.body.data.egradename).to.equal(requestBody.name)
        });
    });

    describe('DELETE /api/v1/grades/id', () => {
        it('Should return success delete message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            let getResponse = await chai.request(httpServer)
                .get(`/api/v1/grades/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data.egradeid).to.not.be.undefined

            const res = await chai.request(httpServer)
                .delete(`/api/v1/grades/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.equal(true)

            getResponse = await chai.request(httpServer)
                .get(`/api/v1/grades/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(404)
            expect(getResponse.body.data).to.be.undefined
        });
    });

    describe('POST /api/v1/grades with superiorId', () => {
        it('Should return single grade', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            expect(login.status).to.equal(200)
            expect(login.body).to.not.be.undefined

            const requestBody = {
                description: 'New Device for Project A',
                name: '201020102010',
                companyId: 1,
                superiorId: 1,
                departmentId: 1
            }

            const res = await chai.request(httpServer)
                .post('/api/v1/grades')
                .set('authorization', login.body.data)
                .send(requestBody)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.egradeid).to.not.be.undefined
            expect(res.body.data.egradedescription).to.equal(requestBody.description)
            expect(res.body.data.egradename).to.equal(requestBody.name)
            expect(res.body.data.egradesuperiorid).to.equal(1)
        });
    });

    describe('GET /api/v1/grades/id/users', () => {
        it('Should return user list of 1 grade', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let page = 0
            let size = 10
            let id = 1

            const res = await chai.request(httpServer)
                .get(`/api/v1/grades/${id}/users?page=${page}&size=${size}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.paging).to.not.be.undefined
            expect(res.body.paging.page).to.equal(page)
            expect(res.body.paging.size).to.equal(size)
        });
    });

    describe('GET /api/v1/grades with department', () => {
        it('Should return grade list within department', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let page = 0
            let size = 10
            let companyId = 2
            let departmentId = 1

            const res = await chai.request(httpServer)
                .get(`/api/v1/grades?page=${page}&size=${size}&companyId=${companyId}&departmentId=${departmentId}`)
                .set('authorization', login.body.data)
                .send()

            console.log(res.body.data)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.paging).to.not.be.undefined
            expect(res.body.paging.page).to.equal(page)
            expect(res.body.paging.size).to.equal(size)
        });
    });
}