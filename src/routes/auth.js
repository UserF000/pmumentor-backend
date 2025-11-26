

import express from "express";
import { db, nextId, findUserByEmail, publicUser } from "../db/db.js";

const router = express.Router();


router.post("/signup", (req, res) => {
  const { pmu_id, email, password, role = "student", name = "", major = "", bio = "" } = req.body;

  if (!pmu_id || !email || !password)
    return res.status(400).json({ error: "pmu_id, email and password are required" });
  if (!db.roles.includes(role)) return res.status(400).json({ error: "Invalid role" });
  if (findUserByEmail(email)) return res.status(409).json({ error: "Email already exists" });

  const user = { id: nextId("users"), pmu_id, email, password, role };
  db.users.push(user);
  db.profiles.push({ id: nextId("profiles"), user_id: user.id, name, major, bio });

  
  res.json({ user: publicUser(user), token: String(user.id) });
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });

  res.json({ user: publicUser(user), token: String(user.id) });
});

export default router;
