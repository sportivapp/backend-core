module.exports = (chai, httpServer, expect) => {

    describe('POST /api/v1/devices', () => {
        it('Should return single device', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            expect(login.status).to.equal(200)
            expect(login.body).to.not.be.undefined

            const requestBody = {
                info: 'New Device',
                imei: '201020102010',
                companyId: 1,
            }

            const res = await chai.request(httpServer)
                .post('/api/v1/devices')
                .set('authorization', login.body.data)
                .send(requestBody)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.edeviceid).to.not.be.undefined
            expect(res.body.data.edeviceidinfo).to.equal(requestBody.info)
            expect(res.body.data.edeviceimei).to.equal(requestBody.imei)
        });
    });

    describe('GET /api/v1/devices', () => {
        it('Should return device list', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let page = 0
            let size = 10

            const res = await chai.request(httpServer)
                .get(`/api/v1/devices?page=${page}&size=${size}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.paging).to.not.be.undefined
            expect(res.body.paging.page).to.equal(page)
            expect(res.body.paging.size).to.equal(size)
        });
    });

    describe('GET /api/v1/devices/id', () => {
        it('Should return a single device by id', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            const res = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
        });
    });

    describe('PUT /api/v1/devices/id', () => {
        it('Should return success update message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                });

            let id = 1

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data.edeviceidinfo).to.not.be.undefined

            const requestBody = {
                info: `${getResponse.body.data.edeviceidinfo} Edited`,
                imei: getResponse.body.data.edeviceimei
            }

            const res = await chai.request(httpServer)
                .put(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send(requestBody);

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.edeviceidinfo).to.equal(`${getResponse.body.data.edeviceidinfo} Edited`)
        });
    });

    describe('POST /api/v1/devices/id/projects', () => {
        it('Should return project list of 1 device', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data).to.not.be.undefined

            const request = {
                projectIds: [1]
            }

            const res = await chai.request(httpServer)
                .post(`/api/v1/devices/${id}/projects`)
                .set('authorization', login.body.data)
                .send(request)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.length).to.greaterThan(0)
        });
    });

    describe('GET /api/v1/devices/id/projects', () => {
        it('Should return project list of 1 device', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            let page = 0
            let size = 10

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data).to.not.be.undefined
            expect(getResponse.body.data.edeviceidinfo).to.not.be.undefined

            const res = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}/projects?page=${page}&size=${size}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
        });
    });

    describe('DELETE /api/v1/devices/id', () => {
        it('Should return success delete message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            let id = 1

            let getResponse = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data.edeviceidinfo).to.not.be.undefined
            expect(getResponse.body.data.edeviceimei).to.not.be.undefined

            const res = await chai.request(httpServer)
                .delete(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.equal(true)

            getResponse = await chai.request(httpServer)
                .get(`/api/v1/devices/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(404)
            expect(getResponse.body.data).to.be.undefined
        });
    });
}