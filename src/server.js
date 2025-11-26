
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import mentorRoutes from "./routes/mentors.js";
import { attachUser } from "./middleware/auth.js";
import { seed } from "./db/init.js";

seed();

const app = express();
app.use(cors());
app.use(express.json());
app.use(attachUser); 

app.get("/", (_req, res) => res.json({ ok: true, service: "PmuMentor API (demo)" }));
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);


app.use((_req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
