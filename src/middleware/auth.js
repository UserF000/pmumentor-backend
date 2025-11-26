
import { db } from "../db/db.js";


export function attachUser(req, _res, next) {
  const userId = Number(req.header("x-user-id"));
  if (userId) {
    const user = db.users.find(u => u.id === userId);
    if (user) req.user = user;
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

