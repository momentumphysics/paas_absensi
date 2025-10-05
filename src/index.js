
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Setup koneksi database PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'db', // 'db' adalah nama service di docker-compose
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(express.static('src/public'));

// Rute utama
app.get('/', (req, res) => {
  res.render('index');
});

// Rute untuk menampilkan form
app.get('/absensi', (req, res) => res.render('absensi', { message: '' }));
app.get('/laporan', (req, res) => res.render('laporan', { message: '' }));
app.get('/pengaduan', (req, res) => res.render('pengaduan', { message: '' }));

// Rute untuk memproses data form
app.post('/absensi', async (req, res) => {
  const { nama, status } = req.body;
  try {
    await pool.query('INSERT INTO absensi (nama, status) VALUES ($1, $2)', [nama, status]);
    res.render('absensi', { message: 'Absensi berhasil dicatat!' });
  } catch (err) {
    console.error(err);
    res.render('absensi', { message: 'Gagal mencatat absensi.' });
  }
});

app.post('/laporan', async (req, res) => {
  const { lokasi, deskripsi } = req.body;
  try {
    await pool.query('INSERT INTO laporan_lalulintas (lokasi, deskripsi) VALUES ($1, $2)', [lokasi, deskripsi]);
    res.render('laporan', { message: 'Laporan berhasil dikirim!' });
  } catch (err) {
    console.error(err);
    res.render('laporan', { message: 'Gagal mengirim laporan.' });
  }
});

app.post('/pengaduan', async (req, res) => {
  const { subjek, deskripsi } = req.body;
  try {
    await pool.query('INSERT INTO pengaduan (subjek, deskripsi) VALUES ($1, $2)', [subjek, deskripsi]);
    res.render('pengaduan', { message: 'Pengaduan berhasil dikirim!' });
  } catch (err) {
    console.error(err);
    res.render('pengaduan', { message: 'Gagal mengirim pengaduan.' });
  }
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
