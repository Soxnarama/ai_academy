// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");

// Routes pour la gestion des cours
router.get("/", coursesController.index);  // Afficher tous les cours
router.get("/new", coursesController.new);  // Afficher le formulaire de création de cours
router.post("/create", coursesController.create);  // Créer un nouveau cours
router.get("/:id", coursesController.show);  // Afficher un cours spécifique
router.get("/:id/edit", coursesController.edit);  // Afficher le formulaire d'édition du cours
router.put("/:id/update", coursesController.update);  // Mettre à jour un cours
router.delete("/:id/delete", coursesController.delete);  // Supprimer un cours

module.exports = router;
