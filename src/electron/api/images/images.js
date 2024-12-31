import express from "express";
import { db, upload } from "../../lib.js";
import fs from "fs";
import { uploadsDir } from "../../main.js";

export const router = express.Router();

router.get("/", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Erreur lors de la lecture du répertoire :", err);
      return res.status(500).send("Unable to scan directory: " + err);
    }

    // Filtrer seulement les fichiers d'images
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/.test(file)
    );
    const imagePaths = imageFiles.map((file) => `/uploads/${file}`);

    res.json(imagePaths);
  });
});

router.post("/", upload.single("image"), (req, res) => {
  const imagePath = req.file.path; // Chemin complet du fichier téléchargé

  // Enregistrer le chemin dans la base de données
  console.log("Upload: ", imagePath);

  res.json({ path: imagePath });
});
