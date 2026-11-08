import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Podatki o uporabniku, ki jih pošljemo frontendu (brez gesla)
function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role, display_name: user.display_name };
}

// POST /api/auth/register – registracija novega uporabnika (US-01)
router.post('/register', async (req, res) => {
  const { email, password, role, display_name } = req.body;

  // Preverjanje podatkov
  if (!email || !password || !role || !display_name) {
    return res.status(400).json({ error: 'Izpolni vsa polja.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Geslo mora imeti vsaj 8 znakov.' });
  }
  // Administratorja se ne da registrirati, ustvari se s seed skripto
  if (role !== 'company' && role !== 'creator') {
    return res.status(400).json({ error: 'Izberi vlogo podjetje ali ustvarjalec.' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Uporabnik s tem e-poštnim naslovom že obstaja.' });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      role,
      display_name,
      // Podjetje dobi tudi profil podjetja (ime je zaenkrat enako prikaznemu imenu)
      company: role === 'company' ? { create: { name: display_name } } : undefined,
    },
  });

  res.status(201).json(publicUser(user));
});

// POST /api/auth/login – prijava z e-pošto in geslom (US-01)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email || '' } });
  // Enako sporočilo za napačno e-pošto in geslo, da ne izdamo, kateri računi obstajajo
  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    return res.status(401).json({ error: 'Napačna e-pošta ali geslo.' });
  }
  if (user.is_blocked) {
    return res.status(403).json({ error: 'Račun je blokiran.' });
  }

  // JWT žeton z id-jem in vlogo, velja 7 dni
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // httpOnly: JavaScript v brskalniku piškotka ne more prebrati
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json(publicUser(user));
});

// POST /api/auth/logout – odjava (izbriše piškotek)
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

// GET /api/auth/me – podatki o trenutno prijavljenem uporabniku
router.get('/me', requireAuth(), (req, res) => {
  res.json(publicUser(req.user));
});

export default router;
