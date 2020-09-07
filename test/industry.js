module.exports = (chai, httpServer, expect) => {

    describe('GET /api/v1/industry', () => {
        it('Should return industry list', async () => {
            const login = await chai.request(httpServer)
                .post('/api/v1/user-login')
                .send({
                    email: 'nawakaraadmin@nawakara.com',
                    password: 'emtivnawakaraadmin'
                })

            const res = await chai.request(httpServer)
                .get(`/api/v1/industry`)
                .set('authorization', login.body.data)
                .send()

            console.log(res.body.data)

            expect(res.status).to.equal(200)
            expect(res.body.data).to.not.be.undefined
            expect(res.body.data.length).to.greaterThan(0)
        });
    });
}