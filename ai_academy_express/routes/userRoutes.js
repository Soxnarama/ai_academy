// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

// Vérifie que l'utilisateur est connecté pour toutes les routes
router.use(authController.ensureLoggedIn);

router.get("/api-token", usersController.getApiToken);


// Routes CRUD pour les utilisateurs

router.get("/", usersController.index, usersController.indexView);  // Afficher la liste des utilisateurs
router.get("/new", usersController.new);  // Afficher le formulaire de création d'utilisateur
router.post("/create", usersController.validate, usersController.create, usersController.redirectView);  // Créer un utilisateur
router.get("/:id", usersController.show, usersController.showView);  // Afficher un utilisateur spécifique
router.get("/:id/edit", usersController.edit);  // Afficher le formulaire d'édition d'utilisateur
router.put("/:id/update", usersController.update, usersController.redirectView);  // Mettre à jour un utilisateur
router.delete("/:id/delete", usersController.delete, usersController.redirectView);  // Supprimer un utilisateur

module.exports = router;
