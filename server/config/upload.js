const multer = require('multer');
const path = require('path');

// 1. Atur Lokasi Penyimpanan dan Nama File
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Simpan file di folder 'uploads' di root directory
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Ubah nama file biar unik (pake tanggal + detik)
        // Contoh: file-17092833.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Filter: Hanya boleh upload gambar (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false); // Tolak file selain gambar
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Batas ukuran file 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;