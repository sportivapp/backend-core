module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/project', () => {
        it('Should return single project', async () => {
          const res = await chai.request(httpServer)
          .post('/api/v1/project')
          .send({
            eprojectcode: '1A',
            eprojectname: 'SatuA',
            eprojectstartdate: '2020-07-24',
            eprojectenddate: '2020-12-24',
            eprojectcreateby: 1,
          });
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
}