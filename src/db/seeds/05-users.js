exports.seed = (knex, Promise) => knex('euser').del()
  .then(() =>
    knex('euser').insert(
      [
        {
          eusernik: 'E1',
          eusername: 'nawakaraadmin',
          euseremail: 'nawakaraadmin@nawakara.com',
          euserpassword: '$2y$10$UzQchZo/FrFs4UMzrRPp2OXj.tjV495wGW977M4SSczXqdVUWRaKu',
          eusermobilenumber: '987654321',
          euseridentitynumber: "3600312523345675"
        },
        {
          eusernik: 'E2',
          eusername: 'nawakarahrd',
          euseremail: 'nawakarahrd@nawakara.com',
          euserpassword: '$2y$10$WdQCsI5fJycPmk4OVOzl0O70qSQAF44UFADY/2LuX3X5X15jQfns6',
          eusermobilenumber: '987654321',
          euseridentitynumber: "3600312520986231"
        },
        {
          eusernik: 'E3',
          eusername: 'nawakarapm',
          euseremail: 'nawakarapm@nawakara.com',
          euserpassword: '$2y$10$Bvc8IkjHw420Eu7T/PbwwOfnKRuhy0NP3P3FwLkm7hdzPJ2lFdvs.',
          eusermobilenumber: '888888888',
          euseridentitynumber: "3600312523345333"
        },
        {
          eusernik: 'E4',
          eusername: 'nawakarauser1',
          euseremail: 'nawakarauser1@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          euseridentitynumber: "3600312523345111"
        },
        {
          eusernik: 'E5',
          eusername: 'nawakarauser2',
          euseremail: 'nawakarauser2@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          euseridentitynumber: "3600312523345999"
        },
        {
          eusernik: 'E6',
          eusername: 'nawakarauser3',
          euseremail: 'nawakarauser3@nawakara.com',
          euserpassword: '$2y$10$0QN7AN62i6hjTMboj2OAROle8q9D9prO41KgUYgniRnGWqo2G6YN.',
          eusermobilenumber: '11111111',
          euseridentitynumber: "3600312523341234",
          euseraddress: 'Alamat rumah',
          ecountryecountryid: 1,
          eusergender: 'male',
          euserdob: 660960000
        },
        {
          eusernik: 'A1',
          eusername: 'yeyen',
          euseremail: 'yeyen@apssi.com',
          euserpassword: '$2y$10$qT1LlCeYbe5DLKtzYk/C.eK1gSFJjRg1xK9WfouFVjuTfwWFBBVE2',
          eusermobilenumber: '11111111',
          euseridentitynumber: "3600312523341234",
          euseraddress: 'Alamat rumah',
          ecountryecountryid: 1,
          eusergender: 'male',
          euserdob: 660960000
        },
        // 8
        {
          eusernik: '',
          eusername: 'Mundari Karya',
          euseremail: 'mkarya1957@gmail.com',
          euserpassword: '$2y$10$kWHosh2Tz6wlMPUwIwmhnuDQtoiTxanLCCVuEa1viHMQBGwpmXkGO',
          eusermobilenumber: '0817154672',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 27
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Djadjang Nurdjaman',
          euseremail: 'djadjangnurdjaman@yahoo.com',
          euserpassword: '$2y$10$5n/CG49Y8pK70caGGfkkqOjU40z/wUYrp321M7ZoB7AV40HA9f6wW',
          eusermobilenumber: '081220204935',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 28
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'ZUCHLI IMRAN PUTRA SH MH',
          euseremail: 'zip.lawyer@yahoo.com',
          euserpassword: '$2y$10$FDqh4XvpQ4YyQCSIov9nf.p3EW71XJ5fW9S5jxuYXx64hGxx1/LgC',
          eusermobilenumber: '081212013700',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 29
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Yulio Mariem Putra, M. PD',
          euseremail: 'mariemputrayulio@gmail.com',
          euserpassword: '$2y$10$PbonGY56opUWhfNYQFEGdeo3O9tRv1mLFMODKDZkKpPwItIAyYMGy',
          eusermobilenumber: '081288517658',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 30
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Yeyen Tumena',
          euseremail: 'tumena.yeyen@yahoo.com',
          euserpassword: '$2y$10$mFX3i4fqSa1KOiBwFywya.vt1zO1icoiWXNJ6vwKde1Pff3l6J3uW',
          eusermobilenumber: '08111014406',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 31
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Bambang Nurdiansyah SE',
          euseremail: 'benbs_coach17@yahoo.com',
          euserpassword: '$2y$10$V4ndZYhVysNEA1tSO6yaKu0eOjzW67SuH38lIGpinS7O5se.hpt5e',
          eusermobilenumber: '081911143330',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 32
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Weshley Hutagalung',
          euseremail: 'weshbola@gmail.com',
          euserpassword: '$2y$10$9/HGR8K9tN9ISYs1D2BskeCZDwucBGcxVf0TuCncvTbe.Wj6G4kqe',
          eusermobilenumber: '0811880895',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 33
          // euserdob: 
        },
      ]
    ));