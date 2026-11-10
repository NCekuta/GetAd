import prisma from '../db.js';

// Samodejno zaprtje questov ob izteku roka (US-06, ADR-0007).
// Ni ločenega procesa (cron): pred vsakim zahtevkom za queste z eno poizvedbo
// vse odprte queste s pretečenim rokom prestavimo v stanje judging.
// Tako je stanje vedno pravilno, ko ga kdo prebere, in oddaja po roku ni mogoča.
export async function closeExpiredQuests(req, res, next) {
  await prisma.quest.updateMany({
    where: { status: 'open', deadline: { lt: new Date() } },
    data: { status: 'judging' },
  });
  next();
}
