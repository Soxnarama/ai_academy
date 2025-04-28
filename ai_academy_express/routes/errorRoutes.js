// routes/errorRoutes.js
const express = require("express");
const router = express.Router();

// Route pour les erreurs 404
router.use((req, res) => {
  res.status(404).render("error/404");  // Afficher une page d'erreur 404
});

module.exports = router;
