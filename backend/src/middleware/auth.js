import jwt from 'jsonwebtoken';
import prisma from '../db.js';

// Middleware, ki preveri, ali je uporabnik prijavljen in ali ima ustrezno vlogo.
// Uporaba: requireAuth() – samo prijava, requireAuth('admin') – samo administrator,
//          requireAuth('company', 'admin') – podjetje ali administrator
export function requireAuth(...roles) {
  return async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Nisi prijavljen.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Seja je potekla, prijavi se ponovno.' });
    }

    // Uporabnika preberemo iz baze, da takoj upoštevamo blokado
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.is_blocked) {
      res.clearCookie('token');
      return res.status(401).json({ error: 'Račun ni na voljo.' });
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Nimaš dostopa.' });
    }

    req.user = user; // na voljo v nadaljnji obdelavi zahtevka
    next();
  };
}
