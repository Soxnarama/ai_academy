const express = require("express");
const router = express.Router();
const subscribersController = require("../controllers/subscribersController");

// Routes pour la gestion des abonnés
router.get("/", subscribersController.getAllSubscribers);  // Afficher tous les abonnés
router.get("/new", subscribersController.getSubscriptionPage);  // Afficher le formulaire d'abonnement
router.post("/create", subscribersController.saveSubscriber);  // Créer un nouvel abonné
router.get("/:id", subscribersController.show);  // Afficher un abonné spécifique
router.get("/:id/edit", subscribersController.editSubscriber);  // Afficher le formulaire d'édition d'abonné
router.put("/:id/update", subscribersController.updateSubscriber);  // Mettre à jour un abonné
router.delete("/:id/delete", subscribersController.deleteSubscriber);  // Supprimer un abonné

module.exports = router;
