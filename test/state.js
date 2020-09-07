module.exports = (chai, httpServer, expect) => {

    describe('GET /api/v1/state', () => {
        it('Should return list of state data', async () => {


            let page = 0
            let size = 50
            let countryId = 1

            const res = await chai.request(httpServer)
            .get(`/api/v1/state?page=${page}&size=${size}&countryId=${countryId}`)
            .send();

            expect(res.status).to.equal(200);
            expect(res.body.data).to.not.be.undefined;
        });
      });
}