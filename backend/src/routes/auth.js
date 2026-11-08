import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';

const router = Router();

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

  res.status(201).json({ id: user.id, email: user.email, role: user.role, display_name: user.display_name });
});

export default router;
