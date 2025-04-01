const http = require('http');
const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status-codes');
const messages = require('./messages'); // Assurez-vous que ce fichier contient les messages
const port = 3000;

// Types MIME pour les différents fichiers
const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};

// Fonction pour servir un fichier
const serveFile = (filePath, res) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(httpStatus.INTERNAL_SERVER_ERROR);
            res.end('Erreur lors de la lecture du fichier');
            return;
        }
        const extension = path.extname(filePath);
        const contentType = contentTypes[extension] || 'text/plain';
        res.writeHead(httpStatus.OK, {
            'Content-Type': contentType + '; charset=UTF-8'
        });
        res.end(data);
    });
};

// Fonction pour récupérer les données POST
const getPostData = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(new URLSearchParams(body));
    });
};

// Gérer les requêtes
const handleRequest = (req, res) => {
    let url = req.url;

    // Traiter la soumission du formulaire de contact
    if (url === '/contact' && req.method === 'POST') {
        getPostData(req, (data) => {
            const name = data.get('name');
            const phone = data.get('phone');
            const email = data.get('email');
            const message = data.get('message');

            // Page de confirmation avec un style amélioré
            res.writeHead(httpStatus.OK, { 
                'Content-Type': 'text/html; charset=UTF-8' 
            });
            res.end(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmation - AI Academy</title>
                    <link rel="stylesheet" href="/css/styles.css">
                </head>
                <body>
                    <div class="confirmation-container">
                        <h1>Message envoyé avec succès !</h1>
                        <p>Merci ${name}, votre message a bien été reçu.</p>
                        <div class="contact-details">
                            <p><strong>Téléphone:</strong> ${phone}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Message:</strong> ${message}</p>
                        </div>
                        <a href="/" class="home-link">Retour à l'accueil</a>
                    </div>
                </body>
                </html>
            `);
        });
        return;
    }

    // Gérer la route de l'API pour récupérer les messages en JSON
    if (url === '/api/messages' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(messages)); // Envoie les messages en format JSON
        return;
    }

    // Si l'URL est /, servir index.html
    if (url === '/') {
        serveFile('./views/index.html', res);
        return;
    }

    // Vérifier si l'URL correspond à un fichier dans le dossier views
    if (url.match(/^\/(about|courses|contact)$/)) {
        serveFile(`./views${url}.html`, res);
        return;
    }

    // Vérifier si l'URL correspond à un fichier statique
    if (url.match(/^\/(css|js|images)\//)) {
        const filePath = `./public${url}`;
        fs.access(filePath, fs.constants.F_OK, (error) => {
            if (error) {
                serveFile('./views/error.html', res);
                return;
            }
            serveFile(filePath, res);
        });
        return;
    }

    // Si aucune route ne correspond, retourner une erreur 404
    serveFile('./views/error.html', res);
};

const app = http.createServer(handleRequest);
app.listen(port);
console.log(`Le serveur a démarré et écoute sur le port: ${port}`);
