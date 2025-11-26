
import express from "express";
import { db, nextId } from "../db/db.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();


router.get("/", (_req, res) => {
  const list = db.mentors.map(m => {
    const user = db.users.find(u => u.id === m.user_id);
    const profile = db.profiles.find(p => p.user_id === m.user_id);
    return {
      mentor_id: m.id,
      user: { id: user.id, pmu_id: user.pmu_id, email: user.email },
      profile: profile ? { name: profile.name, major: profile.major, bio: profile.bio } : null
    };
  });
  res.json(list);
});


router.post("/availability", requireRole("mentor"), (req, res) => {
  const mentor = db.mentors.find(m => m.user_id === req.user.id);
  if (!mentor) return res.status(400).json({ error: "No mentor record for user" });

  const { date, start_time, end_time } = req.body;
  if (!date || !start_time || !end_time)
    return res.status(400).json({ error: "date, start_time, end_time required" });

  const slot = {
    id: nextId("availability"),
    mentor_id: mentor.id,
    date, start_time, end_time,
    is_booked: false
  };
  db.availability.push(slot);
  res.json(slot);
});


router.post("/requests", requireRole("student"), (req, res) => {
  const { mentor_id, date, time } = req.body;
  if (!mentor_id || !date || !time)
    return res.status(400).json({ error: "mentor_id, date, time required" });

  const reqObj = {
    id: nextId("requests"),
    mentee_id: req.user.id,
    mentor_id,
    date, time,
    status: "pending",
  };
  db.requests.push(reqObj);

  db.notifications.push({
    id: nextId("notifications"),
    user_id: db.mentors.find(m => m.id === mentor_id)?.user_id,
    message: "New mentorship request",
    type: "request",
    created_at: new Date().toISOString(),
  });

  res.json(reqObj);
});


router.get("/requests/mine", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  let items;
  if (req.user.role === "student") {
    items = db.requests.filter(r => r.mentee_id === req.user.id);
  } else if (req.user.role === "mentor") {
    const mentor = db.mentors.find(m => m.user_id === req.user.id);
    items = db.requests.filter(r => r.mentor_id === mentor?.id);
  } else {
    items = db.requests;
  }
  res.json(items);
});


router.patch("/requests/:id", requireRole("mentor"), (req, res) => {
  const request = db.requests.find(r => r.id === Number(req.params.id));
  if (!request) return res.status(404).json({ error: "Not found" });

  const mentor = db.mentors.find(m => m.user_id === req.user.id);
  if (request.mentor_id !== mentor?.id) return res.status(403).json({ error: "Not your request" });

  const { status } = req.body; 
  if (!["accepted", "declined"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  request.status = status;
  res.json(request);
});

export default router;
