import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from './db.js';

const app = express();

app.use(express.json()); // telo zahtevka v JSON obliki
app.use(cookieParser()); // branje piškotkov (JWT žeton)

// Testna pot: preveri, ali backend deluje in ali je baza dosegljiva
app.get('/api/health', async (req, res) => {
  const users = await prisma.user.count();
  res.json({ ok: true, users });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend teče na http://localhost:${port}`);
});
