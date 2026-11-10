import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from './db.js';
import authRoutes from './routes/auth.js';
import questRoutes from './routes/quests.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(express.json()); // telo zahtevka v JSON obliki
app.use(cookieParser()); // branje piškotkov (JWT žeton)

// Testna pot: preveri, ali backend deluje in ali je baza dosegljiva
app.get('/api/health', async (req, res) => {
  const users = await prisma.user.count();
  res.json({ ok: true, users });
});

app.use('/api/auth', authRoutes); // registracija, prijava, odjava
app.use('/api/quests', questRoutes); // questi (ustvarjanje, urejanje)
app.use('/api/admin', adminRoutes); // administrator (pregled questov)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend teče na http://localhost:${port}`);
});
