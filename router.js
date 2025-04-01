const httpStatus = require('http-status-codes');
const utils = require('./utils');
const contentTypes = require('./contentTypes');
const homeController = require('./controllers/homeController');
const coursesController = require('./controllers/coursesController');
const contactController = require('./controllers/contactController');

// Objet pour stocker les routes
const routes = {
  "GET": {},
  "POST": {}
};

// Gestionnaire de routes
const handle = (req, res) => {
  try {
    // Vérifier si l'URL demande une ressource statique
    if (req.url.match(/^\/public\//) && req.method === "GET") {
      const filePath = req.url.substring(1); // Retirer le slash initial
      utils.getFile(filePath, res);
      return;
    }

    // Extraire l'ID du cours si l'URL est au format /api/courses/:id
    if (req.url.match(/^\/api\/courses\/\d+$/) && req.method === "GET") {
      const id = req.url.split("/").pop();
      coursesController.getCourseById(req, res, id);
      return;
    }

    // Rediriger les URLs /css, /js, /images vers /public/css, etc.
    if (req.url.match(/^\/(css|js|images)\//) && req.method === "GET") {
      const filePath = `public${req.url}`;
      utils.getFile(filePath, res);
      return;
    }

    // Vérifier si la route existe dans notre objet routes
    if (routes[req.method][req.url]) {
      routes[req.method][req.url](req, res);
    } else {
      // Si aucune route ne correspond, servir la page d'erreur
      homeController.getError(req, res);
    }

  } catch (e) {
    console.error(`Erreur: ${e.message}`);
    res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
    res.end("<h1>Erreur 500: Erreur interne du serveur</h1>");
  }
};

// Méthodes pour enregistrer les routes
const get = (url, action) => {
  routes["GET"][url] = action;
};
const post = (url, action) => {
  routes["POST"][url] = action;
};

// Enregistrer toutes les routes
get("/", homeController.getIndex);
get("/about", homeController.getAbout);
get("/courses", coursesController.getCourses);
get("/api/courses", coursesController.getCoursesAPI);
get("/contact", contactController.getContact);
post("/contact", contactController.submitContact);
get("/api/courses/search", coursesController.getCoursesByTitle);


module.exports = { handle, get, post };
