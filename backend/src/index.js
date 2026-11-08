import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json()); // telo zahtevka v JSON obliki
app.use(cookieParser()); // branje piškotkov (JWT žeton)

// Testna pot: preveri, ali backend deluje
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend teče na http://localhost:${port}`);
});
