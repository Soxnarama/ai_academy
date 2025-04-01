const http = require('http');
const httpStatus = require('http-status-codes');
const router = require('./router');
const port = 3000;
const app = http.createServer(router.handle);
app.listen(port);
console.log(`Le serveur a démarré et écoute sur le port: ${port}`);
console.log(`Serveur accessible à l'adresse: http://localhost:${port}`);