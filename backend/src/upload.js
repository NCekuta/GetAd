import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

// Vse delo z datotekami je v tem modulu (ADR-0006).
// Ob selitvi v oblak zamenjamo samo ta modul (npr. s Supabase Storage).

const UPLOAD_DIR = path.join(import.meta.dirname, '..', 'uploads');
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

// Datoteke shranimo v mapo uploads z naključnim imenom, da se imena ne podvajajo
const storage = multer.diskStorage({
  destination: UPLOAD_DIR, // multer mapo ustvari, če še ne obstaja
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});

const imageUploader = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Dovoljeni sta samo JPG in PNG.'));
    }
  },
}).single('image'); // polje obrazca z imenom "image"

// Middleware za nalaganje ene slike; napake vrne kot JSON
export function uploadImage(req, res, next) {
  imageUploader(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Slika je večja od 5 MB.' });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Izberi sliko.' });
    }
    next();
  });
}

// Polna pot do shranjene datoteke (za pošiljanje odjemalcu)
export function filePath(name) {
  return path.join(UPLOAD_DIR, name);
}

// Izbriše datoteko iz mape uploads
export function deleteFile(name) {
  fs.rmSync(filePath(name), { force: true });
}
