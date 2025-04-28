// Routes API pour la gestion des données
const express = require("express");
const router = express.Router();
router.post("/data", apiController.createData);
router.get("/data", apiController.getData);  // Récupérer des données
  // Créer des données


const apiController = require("../controllers/apiController");

router.post("/login", apiController.apiAuthenticate);

// API Routes
router.use(apiController.verifyToken);
// Route pour la documentation (n'a pas besoin de token)
router.get("/documentation", (req, res) => {
    res.render("api/documentation");
    });
// Utilisateurs
router.get("/users", apiController.getAllUsers);
router.get("/users/:id", apiController.getUserById);
router.post("/users", apiController.createUser);
router.put("/users/:id", apiController.updateUser);
router.delete("/users/:id", apiController.deleteUser);
// Cours
router.get("/courses", apiController.getAllCourses);
router.get("/courses/:id", apiController.getCourseById);
router.post("/courses", apiController.createCourse);
router.put("/courses/:id", apiController.updateCourse);
router.delete("/courses/:id", apiController.deleteCourse);
// Abonnés
router.get("/subscribers", apiController.getAllSubscribers);
router.get("/subscribers/:id", apiController.getSubscriberById);
router.post("/subscribers", apiController.createSubscriber);
router.put("/subscribers/:id", apiController.updateSubscriber);
router.delete("/subscribers/:id", apiController.deleteSubscriber);


module.exports = router;

