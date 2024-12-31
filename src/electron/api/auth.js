import express from "express";
import { db } from "../lib.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const router = express.Router();
export const SECRET_KEY = "SECRET_KEY_NAHOOT_56";

// Route pour récupérer tous les utilisateurs
router.get("/list", async (req, res) => {
  try {
    const users = db.prepare(`SELECT * FROM users`).all();
    // console.log({ users });
    return res.json({ user: users.length > 0 ? users[0] : null });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const user = db
      .prepare(`SELECT * FROM users WHERE name = ? LIMIT 1`)
      .get(name);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: "Identifiant ou mot de passe incorrect" });
    }

    // Créer le token JWT
    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY);

    return res.json({ user, token }); // Renvoie l'utilisateur et le token au client
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
});
