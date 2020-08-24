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

    describe('PUT /api/v1/setting/company-module/:companyId', () => {
      it('Should return success update', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({ 
          email: 'nawakaraadmin@nawakara.com', 
          password: 'emtivnawakaraadmin' 
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/setting/company-module/1')
        .set('authorization', login.body.data)
        .send({
          moduleId: 1,
          moduleName: 'Perusahaan'
      });
        
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('GET /api/v1/setting/function-module/:gradeId', () => {
      it('Should return list of functions by grade id', async () => {
  
        const res = await chai.request(httpServer)
        .get('/api/v1/setting/function-module/1')
        .send();
        
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
      });
    });

    describe('PUT /api/v1/setting/company-module/:companyId', () => {
      it('Should return success update', async () => {
        const login = await chai.request(httpServer)
        .post('/api/v1/user-login')
        .send({ 
          email: 'nawakaraadmin@nawakara.com', 
          password: 'emtivnawakaraadmin'
        });
  
        const res = await chai.request(httpServer)
        .put('/api/v1/setting/company-module/1')
        .set('authorization', login.body.data)
        .send([   
          {
              code: "C1",
              name: "Create Company",
              status: true
          },
          {
              code: "C2",
              name: "Create Branch",
              status: true
          }
        ]);
        
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.undefined;
        expect(res.body.data.length).to.equal(2);
      });
    });

}