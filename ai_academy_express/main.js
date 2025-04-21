const express = require("express");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");

const app = express();

// Définir le port
app.set("port", process.env.PORT || 3000);

// Configuration d'EJS comme moteur de template
app.set("view engine", "ejs");
app.use(layouts);

// Middleware pour traiter les données des formulaires
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static("public"));

// notifs
app.use(session({
    secret: "aiacademysecret",
    resave: false,
    saveUninitialized: true
  }));
  app.use(flash());
  
  // Middleware pour rendre les messages flash accessibles dans les vues
  app.use((req, res, next) => {
    res.locals.successMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    res.locals.infoMessages = req.flash("info");
    next();
  });

// Définir les routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.get("/faq", homeController.faq);
app.post("/contact", homeController.processContact);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrer le serveur
app.listen(app.get("port"), () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${app.get("port")}`);
  console.log(`Serveur accessible à l'adresse: http://localhost:${app.get("port")}`);
});
