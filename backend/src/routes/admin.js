import { Router } from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Vse poti v tej datoteki so samo za administratorja
router.use(requireAuth('admin'));

// ---------- Pregled questov (US-03) ----------

// Questi, ki čakajo na pregled, najstarejši prvi
router.get('/quests', async (req, res) => {
  const quests = await prisma.quest.findMany({
    where: { status: 'in_review' },
    include: { company: true, assets: true },
    orderBy: { created_at: 'asc' },
  });
  res.json(quests);
});

// Poišče quest, ki čaka na pregled; sicer vrne null
async function findQuestInReview(id) {
  const quest = await prisma.quest.findUnique({ where: { id: Number(id) } });
  if (!quest || quest.status !== 'in_review') return null;
  return quest;
}

// Odobritev: in_review -> open (quest postane viden ustvarjalcem)
router.post('/quests/:id/approve', async (req, res) => {
  const quest = await findQuestInReview(req.params.id);
  if (!quest) {
    return res.status(404).json({ error: 'Quest ne čaka na pregled.' });
  }

  const updated = await prisma.quest.update({
    where: { id: quest.id },
    data: { status: 'open' },
  });
  res.json(updated);
});

// Zavrnitev z obveznim razlogom: in_review -> draft (podjetje ga lahko popravi)
router.post('/quests/:id/reject', async (req, res) => {
  const reason = req.body.reason?.trim();
  if (!reason) {
    return res.status(400).json({ error: 'Vpiši razlog zavrnitve.' });
  }

  const quest = await findQuestInReview(req.params.id);
  if (!quest) {
    return res.status(404).json({ error: 'Quest ne čaka na pregled.' });
  }

  const updated = await prisma.quest.update({
    where: { id: quest.id },
    data: { status: 'draft', rejection_reason: reason },
  });
  res.json(updated);
});

// ---------- Moderacija oddaj (US-05) ----------

// Oddaje za moderacijo (WF-05), filtrirane po stanju: pending, approved ali rejected
router.get('/submissions', async (req, res) => {
  const allowed = ['pending', 'approved', 'rejected'];
  const status = allowed.includes(req.query.status) ? req.query.status : 'pending';

  const submissions = await prisma.submission.findMany({
    where: { status },
    include: {
      quest: { select: { title: true } },
      creator: { select: { display_name: true } },
    },
    orderBy: { created_at: 'asc' },
  });
  res.json(submissions);
});

// Poišče oddajo, ki čaka na pregled; sicer vrne null
async function findPendingSubmission(id) {
  const submission = await prisma.submission.findUnique({ where: { id: Number(id) } });
  if (!submission || submission.status !== 'pending') return null;
  return submission;
}

// Odobritev oddaje: pending -> approved (postane vidna podjetju)
router.post('/submissions/:id/approve', async (req, res) => {
  const submission = await findPendingSubmission(req.params.id);
  if (!submission) {
    return res.status(404).json({ error: 'Oddaja ne čaka na pregled.' });
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: { status: 'approved', rejection_reason: null },
  });
  res.json(updated);
});

// Zavrnitev oddaje z obveznim razlogom: pending -> rejected (ustvarjalec vidi razlog)
router.post('/submissions/:id/reject', async (req, res) => {
  const reason = req.body.reason?.trim();
  if (!reason) {
    return res.status(400).json({ error: 'Vpiši razlog zavrnitve.' });
  }

  const submission = await findPendingSubmission(req.params.id);
  if (!submission) {
    return res.status(404).json({ error: 'Oddaja ne čaka na pregled.' });
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: { status: 'rejected', rejection_reason: reason },
  });
  res.json(updated);
});

export default router;
