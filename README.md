# RuteKota — Travel Planner

RuteKota adalah aplikasi web untuk menyusun rencana perjalanan, menyimpan destinasi, melihat lokasi pada peta, dan memperkirakan anggaran tiket. Proyek ini dibuat sebagai referensi portofolio PPLG menggunakan React JS dan Vite.

## Fitur
- Dashboard ringkasan jumlah destinasi, estimasi biaya tiket, dan sisa anggaran.
- Mengubah nama perjalanan, tanggal keberangkatan, dan anggaran.
- Pencarian destinasi berdasarkan nama, kota, dan kategori.
- Filter kategori destinasi.
- Menambah serta menghapus destinasi.
- Menandai destinasi sebagai tersimpan.
- Menambahkan atau menghapus tempat dari rencana perjalanan.
- Peta interaktif OpenStreetMap menggunakan Leaflet.
- Membuka susunan koordinat destinasi di Google Maps.
- Ekspor rencana perjalanan ke file TXT.
- Desain responsif untuk desktop, tablet, dan ponsel.

## Teknologi
- React JS
- Vite
- JavaScript
- CSS
- React Leaflet dan Leaflet
- OpenStreetMap
- Lucide React untuk ikon

## Persyaratan
- Node.js versi LTS (disarankan)
- npm
- Koneksi internet untuk memuat peta OpenStreetMap dan Google Fonts

## Cara menjalankan di Windows
1. Ekstrak ZIP ini.
2. Pasang Node.js LTS dari https://nodejs.org/ jika belum terpasang.
3. Buka folder `rutekota` di VS Code.
4. Buka terminal VS Code (Terminal > New Terminal).
5. Jalankan perintah berikut:

```bash
npm install
npm run dev
```

6. Buka alamat lokal yang ditampilkan Vite di terminal, biasanya `http://localhost:5173`.

## Membuat versi produksi

```bash
npm run build
npm run preview
```

Hasil build tersedia di folder `dist`.

## Catatan penting
- Aplikasi ini adalah prototipe frontend. Data destinasi dan rencana perjalanan disimpan dalam state React, sehingga perubahan akan kembali ke data awal saat halaman dimuat ulang. Untuk penggunaan nyata, tambahkan backend/API dan database seperti Node.js + Express + MySQL atau Supabase.
- Destinasi contoh berada di Surabaya. Destinasi yang ditambahkan melalui formulir memakai koordinat perkiraan di sekitar Surabaya; sesuaikan koordinat untuk lokasi yang akurat.
- Garis ungu pada peta menghubungkan titik destinasi sesuai urutan pilihan. Garis ini bukan rute jalan yang dioptimalkan dan tidak menghitung jarak atau waktu tempuh.
- Estimasi tiket hanyalah data contoh, bukan harga resmi terkini. Periksa tarif, jam buka, dan kondisi lokasi sebelum perjalanan.
- Peta menggunakan layanan OpenStreetMap. Penggunaan publik perlu mengikuti kebijakan tile usage OpenStreetMap.
- Jangan menaruh API key rahasia di kode frontend.

## Struktur folder
```text
rutekota/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

## Ide pengembangan berikutnya
- Backend dan autentikasi pengguna.
- Database untuk menyimpan perjalanan.
- Input koordinat atau pilih titik langsung pada peta.
- Optimasi rute menggunakan layanan routing.
- Perkiraan jarak, waktu tempuh, dan biaya transportasi.
- Berbagi rencana perjalanan melalui tautan.
- Pengujian komponen dan validasi formulir yang lebih lengkap.

## Lisensi aset
Peta disediakan oleh OpenStreetMap dan mengikuti kebijakan serta atribusi OpenStreetMap. Font Google Fonts dimuat secara online. Kode proyek ini disediakan sebagai bahan belajar dan portofolio.
