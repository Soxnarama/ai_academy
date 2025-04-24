
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");


// Contrôleurs
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const authController = require("./controllers/authController");

// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy", {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});

const app = express();

// Configuration de l'application
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Configuration des cookies et des sessions
app.use(cookieParser("secret_passcode"));
app.use(
  session({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// Configuration des messages flash
app.use(flash());

// Configuration de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration du User model pour Passport
const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware global pour les variables de session
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});



// Routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
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
// Routes pour les utilisateurs
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);
// Routes pour les cours
app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.new);
app.post("/courses/create", coursesController.create, coursesController.redirectView);
app.get("/courses/:id", coursesController.show, coursesController.showView);
app.get("/courses/:id/edit", coursesController.edit);
app.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
app.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
//pour se loger
app.get("/login", authController.login);
app.post("/login", authController.authenticate);
app.get("/logout", authController.logout, usersController.redirectView);
app.get("/signup", authController.signup);
app.post("/signup", authController.register, usersController.redirectView);
// Routes protégées - accessibles uniquement aux utilisateurs connectés
app.use("/users", authController.ensureLoggedIn);
app.use("/courses/new", authController.ensureLoggedIn);
app.use("/courses/:id/edit", authController.ensureLoggedIn);




// Gestion des erreurs
app.use(errorController.notFound);

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${port}`);
  console.log(`Serveur accessible à l'adresse: http://localhost:${port}`);
});
