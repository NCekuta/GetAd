import { Router } from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { filePath } from '../upload.js';

const router = Router();

// Poišče oddajo prijavljenega ustvarjalca, ki jo je še mogoče spreminjati (US-04).
// Vrne { error, code } ob napaki ali { submission }.
async function findEditableSubmission(id, userId) {
  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
    include: { quest: true },
  });
  if (!submission || submission.creator_id !== userId) {
    return { code: 404, error: 'Oddaja ne obstaja.' };
  }
  // Po roku je quest v stanju judging (closeExpiredQuests), zato zadošča preverjanje stanja
  if (submission.quest.status !== 'open') {
    return { code: 400, error: 'Po roku oddaje ni več mogoče spreminjati.' };
  }
  // Zavrnjena ali umaknjena oddaja je dokončna
  if (submission.status !== 'pending' && submission.status !== 'approved') {
    return { code: 400, error: 'Te oddaje ni več mogoče spreminjati.' };
  }
  return { submission };
}

// Urejanje naslova, opisa in AI orodja do roka.
// Spremenjena oddaja gre ponovno v pregled (pending).
router.put('/:id', requireAuth('creator'), async (req, res) => {
  const { title, description, ai_tool } = req.body;
  if (!title || !description || !ai_tool) {
    return res.status(400).json({ error: 'Izpolni vsa polja.' });
  }

  const { error, code, submission } = await findEditableSubmission(req.params.id, req.user.id);
  if (error) {
    return res.status(code).json({ error });
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: { title, description, ai_tool, status: 'pending' },
  });
  res.json(updated);
});

// Umik oddaje do roka: stanje withdrawn
router.post('/:id/withdraw', requireAuth('creator'), async (req, res) => {
  const { error, code, submission } = await findEditableSubmission(req.params.id, req.user.id);
  if (error) {
    return res.status(code).json({ error });
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: { status: 'withdrawn' },
  });
  res.json(updated);
});

// Predvajanje videa oddaje. Dostop imajo:
// ustvarjalec (svojo oddajo), administrator (vse) in podjetje (samo odobrene oddaje na svojih questih)
router.get('/:id/video', requireAuth(), async (req, res) => {
  const submission = await prisma.submission.findUnique({
    where: { id: Number(req.params.id) },
    include: { quest: { include: { company: true } } },
  });
  if (!submission) {
    return res.status(404).json({ error: 'Oddaja ne obstaja.' });
  }

  const isCreator = submission.creator_id === req.user.id;
  const isAdmin = req.user.role === 'admin';
  const isCompany = submission.quest.company.user_id === req.user.id && submission.status === 'approved';
  if (!isCreator && !isAdmin && !isCompany) {
    return res.status(404).json({ error: 'Oddaja ne obstaja.' });
  }

  // sendFile podpira tudi pošiljanje po delih (Range), zato lahko v predvajalniku previjamo
  res.sendFile(filePath(submission.video_path));
});

export default router;
