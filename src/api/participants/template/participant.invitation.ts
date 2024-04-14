export const participantInvitationTemplate = async (
  activity: string,
  name: string,
  email: string,
  password: string,
  url: string,
) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const now = new Date();
  const date = now.toLocaleDateString().split('/').join('-');
  const day = days[now.getDay()];
  return `  
    <body>
         
      <p>Halo ${name}</p>

      <p>Dengan surel ini kami sampaikan undangan Tes Online ${activity} yang akan dilaksanakan pada:</p>

      <p>Hari, Tanggal : ${day}, ${date}</p>

      <p>Tata cara pengerjaan tes online:</p>
      <p>1. Masuk ke halaman <a href="${url}">AMOEBA</a></p>
      <p>2. Login dengan menggunakan:</p>
          - Email ${email}
          - Password ${password}
      <p>3. Mengikuti petunjuk pelaksanaan test.</p>

      <p>Sebelum melakukan tes online silahkan untuk menyiapkan perangkat yang dibutuhkan, seperti komputer/laptop, jaringan internet, charger, mouse/tetikus, aplikasi Google Chrome/Mozilla Firefox, meja dan tempat duduk yang nyaman.</p>

      <p>Anda wajib mengerjakan tes online secara mandiri dan menjaga keamanan data maupun soal/materi. Kami juga berharap Anda dapat fokus dan optimal dalam mengerjakan tes online ini. Demikian informasi ini kami sampaikan. Atas perhatiannya kami ucapkan terima kasih.</p>

      <p>Salam</p>

      <p>[Tim HR]</p>
    </body>
  `;
};
