// logger.js
const fs = require('fs');
const path = require('path');

// Chemin du fichier journal
const logFilePath = path.join(__dirname, 'logs', 'requests.log');

// Fonction pour ajouter une entrée de journal
const logRequest = (req) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.url} - IP: ${req.socket.remoteAddress}\n`;

    // Créer le dossier logs s'il n'existe pas
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath));
    }

    // Ajouter l'entrée au fichier de journal
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Erreur lors de l\'écriture du journal:', err);
    });
};

module.exports = { logRequest };
