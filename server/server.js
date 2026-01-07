const express = require('express');
const cors = require('cors');
const path = require('path');
// Tambahkan ini di paling atas
const fs = require('fs');
const DATA_FILE = './server/data/database.json';

// Fungsi BANTUAN: Baca Data dari File
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { confessions: [], items: [] }; // Kalau file error/kosong
    }
};

// Fungsi BANTUAN: Tulis Data ke File
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- GANTI ROUTE SEBELUMNYA DENGAN INI ---

// 1. API CONFESS (Update)
app.get('/api/confess', (req, res) => {
    const db = readData();
    res.json(db.confessions.reverse());
});

app.post('/api/confess', (req, res) => {
    const db = readData();
    const newConfess = {
        id: Date.now(),
        pesan: req.body.pesan,
        tanggal: new Date().toLocaleDateString()
    };
    
    db.confessions.push(newConfess);
    writeData(db); // Simpan ke file
    
    res.json({ message: "Sukses", data: newConfess });
});

// 2. API ITEMS (Update)
app.get('/api/items', (req, res) => {
    const db = readData();
    res.json(db.items.reverse());
});

app.post('/api/items', upload.single('foto_barang'), (req, res) => {
    const db = readData();
    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newItem = {
        id: Date.now(),
        nama: req.body.nama,
        status: req.body.status,
        kontak: req.body.kontak,
        foto: fotoPath,
        tanggal: new Date().toLocaleDateString()
    };
    
    db.items.push(newItem);
    writeData(db); // Simpan ke file
    
    res.json({ message: "Sukses", data: newItem });
});

const app = express();
const PORT = 3000;

// === MIDDLEWARE ===
app.use(cors()); // Agar frontend bisa akses backend
app.use(express.json()); // Agar bisa baca data JSON
app.use(express.urlencoded({ extended: true })); // Agar bisa baca data Form

// === STATIC FILES (PENTING!) ===
// 1. Folder 'public' bisa diakses langsung (untuk index.html, css, js)
app.use(express.static('public'));

// 2. Folder 'uploads' bisa diakses lewat URL '/uploads'
// Jadi nanti frontend akses gambar via: http://localhost:3000/uploads/nama-file.jpg
app.use('/uploads', express.static('uploads'));


// === DATABASE SEMENTARA (JSON) ===
// Kita simpan di variable memori dulu agar simpel (data hilang kalau server restart)
// Kalau mau permanen, nanti kita tulis ke file database.json
let confessions = [];
let items = [];

// === ROUTES (JALUR API) ===

// Import config upload yang tadi dibuat
const upload = require('./config/upload');

// 1. API Confess
app.get('/api/confess', (req, res) => {
    res.json(confessions.reverse()); // Tampilkan dari yang terbaru
});

app.post('/api/confess', (req, res) => {
    const { pesan } = req.body;
    const newConfess = {
        id: Date.now(),
        pesan: pesan,
        tanggal: new Date().toLocaleDateString()
    };
    confessions.push(newConfess);
    res.json({ message: "Curhatan terkirim!", data: newConfess });
});

// 2. API Lost & Found (Pake Upload Foto)
app.get('/api/items', (req, res) => {
    res.json(items.reverse());
});

// 'foto_barang' harus sama dengan 'name' di input form HTML nanti
app.post('/api/items', upload.single('foto_barang'), (req, res) => {
    // Kalau user tidak upload foto, kasih foto default atau error
    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newItem = {
        id: Date.now(),
        nama: req.body.nama,
        status: req.body.status, // 'HILANG' atau 'DITEMUKAN'
        kontak: req.body.kontak,
        foto: fotoPath,
        tanggal: new Date().toLocaleDateString()
    };
    
    items.push(newItem);
    res.json({ message: "Barang berhasil diposting!", data: newItem });
});


// === JALANKAN SERVER ===
app.listen(PORT, () => {
    // Cek apakah folder uploads ada, kalau tidak buat folder baru
    if (!fs.existsSync('./uploads')){
        fs.mkdirSync('./uploads');
    }
    console.log(`Server jalan di http://localhost:${PORT}`);
});