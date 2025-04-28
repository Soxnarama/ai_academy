const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const token_key = "votre_clé_secrète_token"; // À mettre dans .env

const getUserParams = body => ({
  name: {
    first: body.first,
    last: body.last
  },
  email: body.email,
  password: body.password,
  zipCode: body.zipCode
});

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("users/index", { users: res.locals.users });
  },

  new: (req, res) => {
    res.render("users/new");
  },

  create: (req, res, next) => {
    let userParams = getUserParams(req.body);
    User.create(userParams)
      .then(user => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la création de l'utilisateur: ${error.message}`);
        res.locals.redirect = "/users/new";
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération de l'utilisateur par ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("users/show");
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération de l'utilisateur par ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la mise à jour de l'utilisateur par ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la suppression de l'utilisateur par ID: ${error.message}`);
        next();
      });
  },

  getApiToken: (req, res) => {
    if (req.user) {
      let signedToken = jsonWebToken.sign(
        {
          data: req.user._id,
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 jours
        },
        token_key
      );
      res.render("users/api-token", {
        token: signedToken
      });
    } else {
      req.flash("error", "Vous devez être connecté pour obtenir un token API.");
      res.redirect("/login");
    }
  },
  validate: (req, res, next) => {
    const { first, last, email, password } = req.body;
    
    // Exemple de validation simple
    if (!first || !last || !email || !password) {
      req.flash('error', 'Tous les champs doivent être remplis');
      return res.redirect('/users/new');
    }
    next(); // Passe au contrôleur suivant
  }
  
};

