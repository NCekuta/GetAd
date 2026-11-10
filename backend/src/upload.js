import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

// Vse delo z datotekami je v tem modulu (ADR-0006).
// Ob selitvi v oblak zamenjamo samo ta modul (npr. s Supabase Storage).

const UPLOAD_DIR = path.join(import.meta.dirname, '..', 'uploads');

// Datoteke shranimo v mapo uploads z naključnim imenom, da se imena ne podvajajo
const storage = multer.diskStorage({
  destination: UPLOAD_DIR, // multer mapo ustvari, če še ne obstaja
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});

// Ustvari middleware za nalaganje ene datoteke z dovoljenimi tipi in največjo velikostjo.
// Napake vrne kot JSON, shranjena datoteka je potem v req.file.
function singleFile(field, allowedTypes, maxMb, typeError) {
  const uploader = multer({
    storage,
    limits: { fileSize: maxMb * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(typeError));
      }
    },
  }).single(field);

  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (err?.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `Datoteka je večja od ${maxMb} MB.` });
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Izberi datoteko.' });
      }
      next();
    });
  };
}

// Referenčna slika questa: JPG ali PNG, do 5 MB (US-02)
export const uploadImage = singleFile('image', ['image/jpeg', 'image/png'], 5, 'Dovoljeni sta samo JPG in PNG.');

// Video oddaje: MP4, do 100 MB (US-04)
export const uploadVideo = singleFile('video', ['video/mp4'], 100, 'Dovoljen je samo video MP4.');

// Polna pot do shranjene datoteke (za pošiljanje odjemalcu)
export function filePath(name) {
  return path.join(UPLOAD_DIR, name);
}

// Izbriše datoteko iz mape uploads
export function deleteFile(name) {
  fs.rmSync(filePath(name), { force: true });
}
