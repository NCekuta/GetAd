import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from './db.js';
import authRoutes from './routes/auth.js';
import questRoutes from './routes/quests.js';
import adminRoutes from './routes/admin.js';
import submissionRoutes from './routes/submissions.js';
import { closeExpiredQuests } from './middleware/closeExpired.js';

const app = express();

app.use(express.json()); // telo zahtevka v JSON obliki
app.use(cookieParser()); // branje piškotkov (JWT žeton)

// Testna pot: preveri, ali backend deluje in ali je baza dosegljiva
app.get('/api/health', async (req, res) => {
  const users = await prisma.user.count();
  res.json({ ok: true, users });
});

app.use('/api/auth', authRoutes); // registracija, prijava, odjava

// Pred poizvedbami o questih najprej zapremo queste s pretečenim rokom (ADR-0007)
app.use('/api/quests', closeExpiredQuests, questRoutes); // questi
app.use('/api/admin', closeExpiredQuests, adminRoutes); // administrator
app.use('/api/submissions', closeExpiredQuests, submissionRoutes); // oddaje (urejanje, umik)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend teče na http://localhost:${port}`);
});
