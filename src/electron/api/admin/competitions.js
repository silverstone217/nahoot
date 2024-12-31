import express from "express";
import { db } from "../../lib.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../../middleware.js";

export const router = express.Router();

// create a new competitions
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !status) {
      return res
        .status(400)
        .json({ error: "Le nom est nécessaire pour continuer" });
    }

    const isNameExist = db
      .prepare(`SELECT * FROM Competitions WHERE name = ?`)
      .get(name);

    if (isNameExist) {
      return res
        .status(400)
        .json({ error: "Une compétition avec ce nom existe déjà" });
    }

    const competition = db
      .prepare(
        `INSERT INTO Competitions (name, description, status) VALUES (?,?,?)`
      )
      .run(name, description, status);

    return res.json({ competition });
  } catch (error) {
    console.error("Erreur lors de la création de la compétition:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const competitions = db.prepare("SELECT * FROM Competitions").all();
    return res.json({ competitions });
  } catch (error) {
    console.error("Erreur lors de la récupération des compétitions:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
});
