// routes/homeRoutes.js
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Route pour la page d'accueil
router.get("/", homeController.index);

module.exports = router;
