const express = require("express");
const path = require('path');
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose"); // Ajout de Mongoose
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");

const session = require("express-session");
const flash = require("connect-flash");

// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy");


const db = mongoose.connection;

// Vérification de la connexion
db.once("open", () => {
  console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});

// Initialisation de l'application Express
const app = express();

// Configuration de l'application Express
app.set("view engine", "ejs"); // Définir EJS comme moteur de template
app.use(layouts); // Utilisation du middleware express-ejs-layouts
app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données de formulaire
app.use(express.json()); // Middleware pour parser les données JSON

app.use(session({
  secret: "secretKey123", // à modifier en prod
  resave: false,
  saveUninitialized: true
}));

// Flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.pageTitle = "Page";
  res.locals.messages = req.flash(); // si tu utilises connect-flash
  next();
});


// Routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);

// Routes pour les abonnés
app.get("/subscribers/search", subscribersController.searchSubscribers);

app.get("/subscribers", subscribersController.getAllSubscribers);  // Affiche tous les abonnés
app.get("/subscribers/new", subscribersController.getSubscriptionPage);  // Affiche le formulaire d'inscription
app.post("/subscribers", subscribersController.saveSubscriber);  // Enregistre un nouvel abonné
app.get("/subscribers/:id", subscribersController.show);  // Affiche les détails d'un abonné
app.get("/subscribers/delete/:id", subscribersController.deleteSubscriber);
app.get('/subscribers/edit/:id', subscribersController.editSubscriber);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);
app.get("/subscribers/edit/:id", subscribersController.editSubscriber);




// Gestion des erreurs
app.use(errorController.notFound);

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${port}`);
  console.log(`Serveur accessible à l'adresse: http://localhost:${port}`);
});
