
import { db, nextId } from "./db.js";

export function seed() {
  if (db.users.length) return; 

 
  const admin = {
    id: nextId("users"),
    pmu_id: "A0001",
    email: "admin@pmu.edu.sa",
    password: "admin123", 
    role: "admin",
  };
  db.users.push(admin);

  
  const mentorAli = {
    id: nextId("users"),
    pmu_id: "M1001",
    email: "ali@pmu.edu.sa",
    password: "pass123",
    role: "mentor",
  };
  const mentorMona = {
    id: nextId("users"),
    pmu_id: "M1002",
    email: "mona@pmu.edu.sa",
    password: "pass123",
    role: "mentor",
  };
  db.users.push(mentorAli, mentorMona);

  db.mentors.push(
    { id: nextId("mentors"), user_id: mentorAli.id },
    { id: nextId("mentors"), user_id: mentorMona.id }
  );

  
  const students = [
    { pmu_id: "S2001", email: "sara@pmu.edu.sa" },
    { pmu_id: "S2002", email: "salman@pmu.edu.sa" },
    { pmu_id: "S2003", email: "hassan@pmu.edu.sa" },
    { pmu_id: "S2004", email: "remma@pmu.edu.sa" },
  ].map(s => ({
    id: nextId("users"),
    pmu_id: s.pmu_id,
    email: s.email,
    password: "pass123",
    role: "student",
  }));
  db.users.push(...students);

  
  db.profiles.push(
    { id: nextId("profiles"), user_id: students[0].id, name: "Sara",   major: "CS", bio: "" },
    { id: nextId("profiles"), user_id: students[1].id, name: "Salman", major: "IT", bio: "" },
    { id: nextId("profiles"), user_id: students[2].id, name: "Hassan", major: "SE", bio: "" },
    { id: nextId("profiles"), user_id: students[3].id, name: "Remma",  major: "IS", bio: "" }
  );

  
  db.events.push({
    id: nextId("events"),
    title: "Career Talk",
    description: "Meet industry mentors",
    start_date: "2025-12-10",
    end_date: "2025-12-10",
    status: "open",
  });
}
