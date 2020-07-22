module.exports = (chai, httpServer, expect) => {
    describe('POST /api/v1/company', () => {
        it('Should return single result of user, company and address after insert', async () => {
          const res = await chai.request(httpServer)
          .post('/api/v1/company')
          .send({
            nik: 123456789,
            name: 'nawakaraadmin', 
            email: 'nawakaraadmin@nawakara.com', 
            password: 'emtivnawakaraadmin', 
            mobileNumber: '987654321',
            companyName: 'PT. Nawakara Perkasa Nusantara',
            companyEmail: '@nawakara.com',
            street: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
            postalCode: 12420
          });
    
          expect(res.status).to.equal(200);
          expect(res.body.data).to.not.be.undefined;
        });
      });
}