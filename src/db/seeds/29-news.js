exports.seed = (knex, Promise) => knex('enews').del()
.then(() =>
  knex('enews').insert(
    [
        {
            enewsdate: 655516800,
            enewstitle: 'Title',
            enewscontent: 'Content',
            enewscreatetime: Date.now(),
            enewscreateby: 1,
            enewschangetime: Date.now(),
            enewschangeby: 1,
            efileefileid: 1,
            ecompanyecompanyid: 1
        },
        {
          enewsdate: 655516800,
          enewstitle: 'APSSI Memasuki Usia 1 Tahun, Bergerak dan Berkembang untuk Sepak Bola Indonesia',
          enewscontent: 'Setelah para pelatih melakukan pertemuan yang kemudian disebut sebagai Kongres Pertama Asosiasi Pelatih Sepakbola Seluruh Indonesia (APSSI) di Gelora Bung Karno, Jakarta, pada 15 September 2019, organisasi pelatih sepak bola ini terus memperkuat diri. Kongres I APSSI pada 15 September 2019 itu resmi memilih Yeyen Tumena sebagai ketua umum dengan didampingi sejumlh Komite Eksekutif (Exco), yakni Emral Abus, Rahmad Darmawan, Bambang Nurdiansyah, Indra Sjafri, Wolfgang Pikal, Djadjang Nurdjaman, Fakhri Husain, Widodo C. Putro, Mundary Karya, Joko Susilo, Syafrianto Rusli. Menurut Yeyen Tumena, keberadaan APSSI bukanlah sesuatu yang baru, walau organisasi pelatih sebelumnya yang pernah ada vakum dan tak aktif lagi. APSSI akan melanjutkan program-program yang baik untuk kemajuan pelatih dan sepak bola Indonesia. “Saya menyebutnya sebagai 3 R sebagai langkah awal menerima tugas memimpin APSSI, yakni re-organisasi, re-program, dan re-branding,” kata Yeyen Tumena, Ketua APSSI 2019-2024. Visi APSSI adalah menjadi suara, advokat, dan rekan terpercaya dalam menyatukan pelatih sepak bola Indonesia di semua level permainan. Sebagai organisasi sepak bola di Tanah Air, APSSI telah resmi menjadi anggota PSSI yang diputuskan pada Kongres PSSI di Bali, Januari 2020, dan tertuang dalam keputusan Kongres Biasa PSSI 2020 Nomor: 05/KEP/KOGRES/I-2020. Pada Maret 2020, APSSI menyampaikan perkembangan tersebut kepada PSSI Pusat pada 10 Maret 2020. Guna membantu dan menjalankan program organisasi, APSSI telah membentuk struktur organisasi dan dibantu oleh tenaga-tenaga yang peduli untuk membangun sepak bola Indonesia. #',
          enewscreatetime: Date.now(),
          enewscreateby: 1,
          enewschangetime: Date.now(),
          enewschangeby: 1,
          efileefileid: 14,
          ecompanyecompanyid: 1
      }
    ]
  ));
