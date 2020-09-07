module.exports = (chai, httpServer, expect) => {

    describe('GET /api/v1/country', () => {
        it('Should return list of country data', async () => {


            let page = 0
            let size = 50

            const res = await chai.request(httpServer)
            .get(`/api/v1/country?page=${page}&size=${size}`)
            .send();

            expect(res.status).to.equal(200);
            expect(res.body.data).to.not.be.undefined;
        });
      });
}