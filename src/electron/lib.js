import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import multer from "multer";
import { uploadsDir } from "./main.js";

// Déterminer le chemin de la base de données
const dbPath =
  process.env.NODE_ENV === "development"
    ? path.join(app.getAppPath(), "./database.db")
    : path.join(process.resourcesPath, "database.db");

// Vérifier si le fichier de base de données existe, sinon le créer
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, ""); // Crée un fichier vide si nécessaire
}

// Initialiser la base de données
const db = new Database(dbPath);

// Créer les tables si elles n'existent pas déjà
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Competitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT CHECK(status IN ('en cours', 'terminée', 'pas encore commencée', 'annulée')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Candidats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS CompetitionCandidats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    competition_id INTEGER,
    candidate_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES Competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES Candidats(id) ON DELETE CASCADE,
    UNIQUE(competition_id, candidate_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    correct_answer TEXT,
    image_path TEXT,
    type TEXT CHECK(type IN ('multiple_choice', 'single_choice', 'writing_answer')) NOT NULL,
    default_point INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    competition_id INTEGER,
    FOREIGN KEY (competition_id) REFERENCES Competitions(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER,
    answer_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER,
    question_id INTEGER,
    competition_id INTEGER,
    response TEXT NOT NULL,
    score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES Candidats(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE,
    FOREIGN KEY (competition_id) REFERENCES Competitions(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER,
    competition_id INTEGER,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES Candidats(id) ON DELETE CASCADE,
    FOREIGN KEY (competition_id) REFERENCES Competitions(id) ON DELETE CASCADE
  );
`);

// Fonction principale pour gérer les utilisateurs
async function main() {
  const hashedPassword = await bcrypt.hash("admin1234", 10);

  // Récupérer les utilisateurs
  const rows = db.prepare(`SELECT * FROM users`).all();

  // Vérifier si aucun utilisateur n'existe
  if (rows.length === 0) {
    // Insérer un nouvel utilisateur admin
    const insert = db.prepare(
      `INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)`
    );

    const info = insert.run(
      "admin",
      "admin@example.com",
      "admin",
      hashedPassword
    );

    console.log(`Utilisateur créé avec l'ID: ${info.lastInsertRowid}`);
  } else {
    console.log("Des utilisateurs existent déjà.");
  }
}

// Exécuter la fonction principale
main().catch((err) =>
  console.error("Erreur lors de l'initialisation de la base de données:", err)
);

// Configuration pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Utiliser le dossier uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp
  },
});

const upload = multer({ storage });

export { db, upload };
