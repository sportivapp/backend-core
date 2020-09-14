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
          eusernik: '5',
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
          eusernik: '7',
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
          eusernik: '15',
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
          eusernik: '17',
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
        // 12
        {
          eusernik: '9',
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
        // 13
        {
          eusernik: '3',
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
        // 14
        {
          eusernik: '10',
          eusername: 'Wesley Hutagalung',
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
        {
          eusernik: '18',
          eusername: 'Heru Pujihartono',
          euseremail: 'herus7black@gmail.com',
          euserpassword: '$2y$10$fBbpC9spxCcRs1ESbnNqN./Raa3/Zw0g86GRijFpP7.ijo7xwHp3a',
          eusermobilenumber: '0812188705570',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 34
          // euserdob: 
        },
        {
          eusernik: '1',
          eusername: 'Emral Abus',
          euseremail: 'emral_abus@yahoo.co.id',
          euserpassword: '$2y$10$/MmJQHszqqtqyLU9iWEaX.RuRc5j3PZzrfjXchP15PtMGmZZGvg6q',
          eusermobilenumber: '081319768005',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 60
          // euserdob: 
        },
        {
          eusernik: '25',
          eusername: 'Miftahudin, SH',
          euseremail: 'miftah.pm99@gmail.com',
          euserpassword: '$2y$10$92OOThh87XvujKE5.aHrm.ekZMqLu/f.nc6quTyCag.nmVF4Q40fi',
          eusermobilenumber: '081399195599',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 61
          // euserdob: 
        },
        // 18
        {
          eusernik: '6',
          eusername: 'Syafrianto Rusli',
          euseremail: 'yanto.rusli61@gmail.com',
          euserpassword: '$2y$10$/jj/EKBB6FbNAJ1yhCiOb.cVJRm9yb0DE69E0lLgq56hMMWjycgl.',
          eusermobilenumber: '08126626344',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 62
          // euserdob: 
        },
        {
          eusernik: '23',
          eusername: 'Galih Purnanda Sakti',
          euseremail: 'zizusakti@gmail.com',
          euserpassword: '$2y$10$HowRbCQqTS/DLXE/eFKphOme3aJg22Da1vcGzEmw4srWU/fHqY9iu',
          eusermobilenumber: '081806418027',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 63
          // euserdob: 
        },
        {
          eusernik: '22',
          eusername: 'Ali Reza',
          euseremail: 'alireza1406@gmail.com',
          euserpassword: '$2y$10$HeIwj6IlWmrPrhvU/Un7S.YEylg23dCqOh.v5cv2FtN2n/4o79hKy',
          eusermobilenumber: '082112112711',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 64
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Fabriant Immanuel Leleng',
          euseremail: 'rianleleng@gmail.com',
          euserpassword: '$2y$10$8tljmHpdzPYn9y3hkAUUkeP0zNNLmVT6WN3Z2EOdpAw2REY4Kq5N6',
          eusermobilenumber: '0818668060',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 65
          // euserdob: 
        },
        // 22
        {
          eusernik: '8',
          eusername: 'Fakhri Husaini',
          euseremail: 'coachfakhri.fh@gmail.com',
          euserpassword: '$2y$10$rSQY4/R.4qjuL8H/V746F.TZz5ogNZvhUKyGOWcHPPvjt3KujqJKC',
          eusermobilenumber: '08125335434',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 66
          // euserdob: 
        },
        {
          eusernik: '26',
          eusername: 'Dino Sutan Karajaan',
          euseremail: 'dinosutan17@gmail.com',
          euserpassword: '$2y$10$cQol5jj4vFEkhimzld3uJ.J8SAMPGUBqcNrnn./qCp4vMcMNbkT4C',
          eusermobilenumber: '081310828017',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 67
          // euserdob: 
        },
        {
          eusernik: '',
          eusername: 'Surya Binanga',
          euseremail: 'suryasimorangkir@gmail.com',
          euserpassword: '$2y$10$SIxoOulWGIp/ffpHQZuwjuUdSENG7lFzuXMVwckedV2zUaoxVDS/a',
          eusermobilenumber: '081381567393',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 68
          // euserdob: 
        },
        {
          eusernik: '21',
          eusername: 'Barry Timothy',
          euseremail: 'barrydarrentimothy@gmail.com',
          euserpassword: '$2y$10$wYSO8ykdiPMIHHus4GclE.xrqbVFphLEjIjr9CcaK87XyCgOGlBci',
          eusermobilenumber: '08129503551',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 69
          // euserdob: 
        },
        {
          eusernik: '12',
          eusername: 'Agus Sungeng Riyanto S.pd',
          euseremail: 'asrrayya@gmail.com',
          euserpassword: '$2y$10$Nxn9.PcfVUpccTOvrce9ZOtGm.rtTVQEQeLGbmddCaakeEzqxdyAu',
          eusermobilenumber: '082261382709',
          euseridentitynumber: '',
          euseraddress: '',
          ecountryecountryid: 1,
          eusergender: 'male',
          efileefileid: 70
          // euserdob: 
        },
      ]
    ));