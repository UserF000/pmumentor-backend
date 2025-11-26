

let _ids = {
  users: 1,
  profiles: 1,
  mentors: 1,
  availability: 1,
  requests: 1,
  events: 1,
  registrations: 1,
  notifications: 1,
  logs: 1,
};

export const db = {
  roles: ["student", "mentor", "admin"],

  users: [],               
  profiles: [],             
  mentors: [],              
  availability: [],         
  requests: [],             
  events: [],               
  registrations: [],        
  notifications: [],       
  logs: []                
};

export const nextId = (table) => _ids[table]++;

export const findUserByEmail = (email) =>
  db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());

export const publicUser = (u) =>
  u ? { id: u.id, pmu_id: u.pmu_id, email: u.email, role: u.role } : null;
