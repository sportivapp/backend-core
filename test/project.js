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
          .set('authorization', login.body.data.token)
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
}