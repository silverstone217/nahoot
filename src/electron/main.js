import { app, BrowserWindow } from "electron";
import path from "path";
import express from "express";
import cors from "cors";
import { db, upload } from "./lib.js";
import { router as AuthRouter } from "./api/auth.js";
import { router as CompetitionsRouter } from "./api/admin/competitions.js";
import { router as ImageRouter } from "./api/images/images.js";
import fs from "fs";

const PORT = 3000;
const appServer = express();

// Middleware
appServer.use(cors());
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));
// Servir les fichiers statiques du dossier dist-react
appServer.use(express.static(path.join(app.getAppPath(), "dist-react")));

// Créez le dossier uploads s'il n'existe pas
export const uploadsDir = path.join(app.getPath("userData"), "uploads");
// Vérifier si le dossier uploads existe, sinon le créer
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Créer le dossier uploads
  console.log(`Dossier créé : ${uploadsDir}`);
} else {
  console.log(`Le dossier existe déjà : ${uploadsDir}`);
}
appServer.use(
  "/uploads",
  express.static(path.join(app.getPath("userData"), "uploads"))
);

// Route pour servir index.html
appServer.get("/", (req, res) => {
  res.sendFile(path.join(app.getAppPath(), "dist-react/index.html"));
});

// Route pour l'authentification
appServer.use("/api/auth", AuthRouter);
// Route pour les compétitions
appServer.use("/api/competitions", CompetitionsRouter);
// Route pour les images
appServer.use("/api/images", ImageRouter);

// Démarrer le serveur Express
const startServer = () => {
  appServer.listen(PORT, () => {
    console.log(
      `Serveur Express en cours d'exécution sur http://localhost:${PORT}`
    );
  });
};

// Middleware pour gérer les erreurs 404
appServer.use((req, res) => {
  res.status(404).redirect("/"); // Redirige vers la page principale
});

// Créer la fenêtre principale de l'application Electron
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  });

  // Chargez l'application depuis le serveur Express
  win.loadURL("http://localhost:3000");
};

// Initialiser l'application Electron
app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter l'application lorsque toutes les fenêtres sont fermées
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
