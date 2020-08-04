module.exports = (chai, httpServer, expect) => {
  
    describe('GET /api/v1/setting/company-module/:companyId', () => {
      it('Should return list of modules of specific company', async () => {
        // const login = await chai.request(httpServer)
        // .post('/api/v1/user-login')
        // .send({ 
        //   email: 'nawakaraadmin@nawakara.com', 
        //   password: 'emtivnawakaraadmin' 
        // });
  
        const res = await chai.request(httpServer)
        .get('/api/v1/setting/company-module/1')
        .send();
        
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

}