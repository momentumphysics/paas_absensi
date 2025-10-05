require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Setup koneksi database PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(express.static('src/public'));

// Rute utama sekarang menampilkan form absensi
app.get('/', (req, res) => {
  res.render('absensi', { message: '', messageType: '' });
});

// Rute untuk memproses data form absensi
app.post('/', async (req, res) => {
  const { nama, status } = req.body;
  try {
    await pool.query('INSERT INTO absensi (nama, status) VALUES ($1, $2)', [nama, status]);
    res.render('absensi', { message: 'Absensi berhasil dicatat!', messageType: 'success' });
  } catch (err) {
    console.error(err);
    res.render('absensi', { message: 'Gagal mencatat absensi.', messageType: 'danger' });
  }
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});