// authMiddleware.js
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./api/auth.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Récupérer le token après "Bearer"

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Stocker les informations de l'utilisateur dans la requête
    next(); // Passer au prochain middleware ou route
  });
};

export { authenticateToken };
