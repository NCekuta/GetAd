import { Router } from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // v milisekundah

// Preveri podatke iz obrazca questa (US-02).
// Vrne { error } ob napaki ali { data } s pripravljenimi podatki za bazo.
function readQuestForm(body) {
  const { title, description, requirements, reward_amount, deadline } = body;

  if (!title || !description || !requirements || !reward_amount || !deadline) {
    return { error: 'Izpolni vsa polja.' };
  }

  const reward = Number(reward_amount);
  if (isNaN(reward) || reward <= 0) {
    return { error: 'Nagrada mora biti pozitivno število.' };
  }

  // Rok pride kot datum (npr. 2026-12-01) in velja do konca tega dne
  const deadlineDate = new Date(`${deadline}T23:59:59`);
  if (isNaN(deadlineDate) || deadlineDate < new Date(Date.now() + SEVEN_DAYS)) {
    return { error: 'Rok mora biti vsaj 7 dni v prihodnosti.' };
  }

  return { data: { title, description, requirements, reward_amount: reward, deadline: deadlineDate } };
}

// Poišče quest, ki pripada prijavljenemu podjetju; sicer vrne null
async function findOwnQuest(questId, userId) {
  const quest = await prisma.quest.findUnique({
    where: { id: Number(questId) },
    include: { company: true },
  });
  if (!quest || quest.company.user_id !== userId) return null;
  return quest;
}

// Ustvarjanje questa – shrani se kot osnutek (draft)
router.post('/', requireAuth('company'), async (req, res) => {
  const { error, data } = readQuestForm(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const company = await prisma.company.findUnique({ where: { user_id: req.user.id } });
  const quest = await prisma.quest.create({
    data: { ...data, company_id: company.id }, // status je privzeto draft
  });

  res.status(201).json(quest);
});

// Podatki o questu za urejanje (samo lastnik)
router.get('/:id', requireAuth('company'), async (req, res) => {
  const quest = await findOwnQuest(req.params.id, req.user.id);
  if (!quest) {
    return res.status(404).json({ error: 'Quest ne obstaja.' });
  }
  res.json(quest);
});

// Urejanje questa – samo lastnik in samo v stanju draft
router.put('/:id', requireAuth('company'), async (req, res) => {
  const quest = await findOwnQuest(req.params.id, req.user.id);
  if (!quest) {
    return res.status(404).json({ error: 'Quest ne obstaja.' });
  }
  if (quest.status !== 'draft') {
    return res.status(400).json({ error: 'Urejati je mogoče samo osnutek.' });
  }

  const { error, data } = readQuestForm(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const updated = await prisma.quest.update({ where: { id: quest.id }, data });
  res.json(updated);
});

export default router;
