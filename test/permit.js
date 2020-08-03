module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/permit pm', () => {
        it('Should return single permit of pm', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                })

            expect(login.status).to.equal(200)
            expect(login.body).to.not.be.undefined

            const requestBody = {
                description: 'Nawakara Permit PM',
                startDate: '2020-12-24',
                endDate: '2020-12-24'
            }

            const res = await chai.request(httpServer)
                .post('/api/v1/permit')
                .set('authorization', login.body.data)
                .send(requestBody)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.epermitid).to.not.be.undefined
            expect(res.body.data.epermitdescription).to.equal(requestBody.description)
        });
    });

    describe('GET /api/v1/permit/id', () => {
        it('Should return a single permit by id', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                })

            const res = await chai.request(httpServer)
                .get('/api/v1/permit/1')
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
        });
    });

    describe('GET /api/v1/permit', () => {
        it('Should return permit list', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                })

            let page = 0
            let size = 10

            const res = await chai.request(httpServer)
                .get(`/api/v1/permit?page=${page}&size=${size}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.paging).to.not.be.undefined
            expect(res.body.paging.page).to.equal(page)
            expect(res.body.paging.size).to.equal(size)
        });
    });

    describe('GET /api/v1/permit/id/request', () => {
        it('Should return a single permit with status change to 1', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarauser2@nawakara.com',
                    password: 'emtivnawakarauser'
                })

            let id = 1

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/permit/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data).to.not.be.undefined
            expect(getResponse.body.data.epermitstatus).to.equal(0)

            const res = await chai.request(httpServer)
                .get(`/api/v1/permit/${id}/request`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.epermitstatus).to.equal(1)
        });
    });

    describe('GET /api/v1/permit/subordinate', () => {
        it('Should return subordinate pending permit list', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                })

            let page = 0
            let size = 10

            const res = await chai.request(httpServer)
                .get(`/api/v1/permit?page=${page}&size=${size}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.paging).to.not.be.undefined
            expect(res.body.paging.page).to.equal(page)
            expect(res.body.paging.size).to.equal(size)
        });
    });

    describe('PUT /api/v1/permit', () => {
        it('Should return success update message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                });

            let id = 3

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/permit/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data.epermitdescription).to.not.be.undefined

            const requestBody = {
                description: `${getResponse.body.data.epermitdescription} Edited`,
                startDate: '2020-12-24',
                endDate: '2020-12-24'
            }

            const res = await chai.request(httpServer)
                .put(`/api/v1/permit/${id}`)
                .set('authorization', login.body.data)
                .send(requestBody);

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.epermitdescription).to.equal(`${getResponse.body.data.epermitdescription} Edited`)
        });
    });

    describe('POST /api/v1/permit/action', () => {
        it('Should return success update message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                });
            let page = 0
            let size = 10

            const getResponse = await chai.request(httpServer)
                .get(`/api/v1/permit/subordinate?page=${page}&size=${size}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data).to.not.be.undefined
            expect(getResponse.body.data.length).to.greaterThan(0)

            const requestBody = {
                permitId: getResponse.body.data[0].epermitid,
                status: 2
            }

            const res = await chai.request(httpServer)
                .post('/api/v1/permit/action')
                .set('authorization', login.body.data)
                .send(requestBody);

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.epermitstatus).to.equal(2)
        });
    });

    describe('DELETE /api/v1/permit/id', () => {
        it('Should return success delete message', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakarapm@nawakara.com',
                    password: 'emtivnawakarapm'
                })

            let id = 3

            let getResponse = await chai.request(httpServer)
                .get(`/api/v1/permit/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(200)
            expect(getResponse.body.data.epermitdescription).to.not.be.undefined

            const res = await chai.request(httpServer)
                .delete(`/api/v1/permit/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(res.status).to.equal(200)
            expect(res.body.data).to.equal(true)

            getResponse = await chai.request(httpServer)
                .get(`/api/v1/permit/${id}`)
                .set('authorization', login.body.data)
                .send()

            expect(getResponse.status).to.equal(404)
            expect(getResponse.body.data).to.be.undefined
        });
    });
}