import { Router } from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage, uploadVideo, filePath, deleteFile } from '../upload.js';

const router = Router();

const MAX_IMAGES = 3; // US-02

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
    include: { company: true, assets: true },
  });
  if (!quest || quest.company.user_id !== userId) return null;
  return quest;
}

// Ali sme uporabnik videti quest: objavljenega vsi prijavljeni,
// osnutek in quest v pregledu pa samo lastnik in administrator
function canViewQuest(quest, user) {
  const isOwner = quest.company.user_id === user.id;
  const isPublished = ['open', 'judging', 'closed'].includes(quest.status);
  return isOwner || isPublished || user.role === 'admin';
}

// Seznam odprtih questov (US-04, WF-01), najnovejši prvi.
// Za kartico potrebujemo ime podjetja in prvo sliko.
router.get('/', requireAuth(), async (req, res) => {
  const quests = await prisma.quest.findMany({
    where: { status: 'open' },
    include: { company: { select: { name: true } }, assets: { take: 1 } },
    orderBy: { created_at: 'desc' },
  });
  res.json(quests);
});

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

// Seznam questov prijavljenega podjetja, najnovejši prvi.
// Mora biti pred potjo /:id, sicer bi Express "mine" razumel kot id.
router.get('/mine', requireAuth('company'), async (req, res) => {
  const quests = await prisma.quest.findMany({
    where: { company: { user_id: req.user.id } },
    orderBy: { created_at: 'desc' },
  });
  res.json(quests);
});

// Podrobnosti questa (WF-02) – uporablja jih tudi obrazec za urejanje
router.get('/:id', requireAuth(), async (req, res) => {
  const quest = await prisma.quest.findUnique({
    where: { id: Number(req.params.id) },
    include: { company: true, assets: true },
  });
  if (!quest || !canViewQuest(quest, req.user)) {
    return res.status(404).json({ error: 'Quest ne obstaja.' });
  }

  // Ustvarjalcu dodamo še njegovo oddajo, da stran ve, ali je že oddal video
  let mySubmission = null;
  if (req.user.role === 'creator') {
    mySubmission = await prisma.submission.findUnique({
      where: { quest_id_creator_id: { quest_id: quest.id, creator_id: req.user.id } },
    });
  }

  res.json({ ...quest, my_submission: mySubmission });
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

// Pošiljanje v pregled adminu (US-02): draft -> in_review
router.post('/:id/submit', requireAuth('company'), async (req, res) => {
  const quest = await findOwnQuest(req.params.id, req.user.id);
  if (!quest) {
    return res.status(404).json({ error: 'Quest ne obstaja.' });
  }
  if (quest.status !== 'draft') {
    return res.status(400).json({ error: 'V pregled je mogoče poslati samo osnutek.' });
  }
  // Osnutek je lahko star, zato rok preverimo še enkrat
  if (quest.deadline < new Date(Date.now() + SEVEN_DAYS)) {
    return res.status(400).json({ error: 'Rok mora biti vsaj 7 dni v prihodnosti. Uredi rok.' });
  }

  const updated = await prisma.quest.update({
    where: { id: quest.id },
    data: { status: 'in_review', rejection_reason: null }, // morebitni stari razlog zavrnitve izbrišemo
  });
  res.json(updated);
});

// Nalaganje referenčne slike (US-02): samo lastnik, samo osnutek, največ 3 slike.
// Najprej preverimo quest, šele nato multer shrani datoteko.
router.post(
  '/:id/images',
  requireAuth('company'),
  async (req, res, next) => {
    const quest = await findOwnQuest(req.params.id, req.user.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest ne obstaja.' });
    }
    if (quest.status !== 'draft') {
      return res.status(400).json({ error: 'Slike je mogoče dodajati samo osnutku.' });
    }
    if (quest.assets.length >= MAX_IMAGES) {
      return res.status(400).json({ error: `Največ ${MAX_IMAGES} slike.` });
    }
    req.quest = quest;
    next();
  },
  uploadImage,
  async (req, res) => {
    const asset = await prisma.questAsset.create({
      data: {
        quest_id: req.quest.id,
        file_path: req.file.filename,
        type: 'image',
        original_name: req.file.originalname,
      },
    });
    res.status(201).json(asset);
  }
);

// Prikaz slike – enaka pravila kot za ogled questa
router.get('/:id/images/:assetId', requireAuth(), async (req, res) => {
  const asset = await prisma.questAsset.findUnique({
    where: { id: Number(req.params.assetId) },
    include: { quest: { include: { company: true } } },
  });
  if (!asset || asset.quest_id !== Number(req.params.id)) {
    return res.status(404).json({ error: 'Slika ne obstaja.' });
  }

  if (!canViewQuest(asset.quest, req.user)) {
    return res.status(404).json({ error: 'Slika ne obstaja.' });
  }

  res.sendFile(filePath(asset.file_path));
});

// Brisanje slike: samo lastnik, samo osnutek
router.delete('/:id/images/:assetId', requireAuth('company'), async (req, res) => {
  const quest = await findOwnQuest(req.params.id, req.user.id);
  const asset = quest?.assets.find((a) => a.id === Number(req.params.assetId));
  if (!asset) {
    return res.status(404).json({ error: 'Slika ne obstaja.' });
  }
  if (quest.status !== 'draft') {
    return res.status(400).json({ error: 'Slike je mogoče brisati samo osnutku.' });
  }

  await prisma.questAsset.delete({ where: { id: asset.id } });
  deleteFile(asset.file_path);
  res.json({ ok: true });
});

// Oddaja videa (US-04): samo ustvarjalec, samo odprt quest (do roka), samo ena oddaja.
// Najprej preverimo quest in prejšnjo oddajo, šele nato multer shrani video.
router.post(
  '/:id/submissions',
  requireAuth('creator'),
  async (req, res, next) => {
    const quest = await prisma.quest.findUnique({ where: { id: Number(req.params.id) } });
    // Po roku je quest že v stanju judging (closeExpiredQuests), zato zadošča preverjanje stanja
    if (!quest || quest.status !== 'open') {
      return res.status(400).json({ error: 'Oddaja je mogoča samo na odprt quest pred rokom.' });
    }

    const existing = await prisma.submission.findUnique({
      where: { quest_id_creator_id: { quest_id: quest.id, creator_id: req.user.id } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Na ta quest si že oddal video.' });
    }

    req.quest = quest;
    next();
  },
  uploadVideo,
  async (req, res) => {
    // Besedilna polja multer prebere skupaj z videom
    const { title, description, ai_tool } = req.body;
    if (!title || !description || !ai_tool) {
      deleteFile(req.file.filename); // video brez podatkov ne potrebujemo
      return res.status(400).json({ error: 'Izpolni vsa polja.' });
    }

    const submission = await prisma.submission.create({
      data: {
        quest_id: req.quest.id,
        creator_id: req.user.id,
        title,
        description,
        ai_tool,
        video_path: req.file.filename, // stanje je privzeto pending
      },
    });
    res.status(201).json(submission);
  }
);

export default router;
