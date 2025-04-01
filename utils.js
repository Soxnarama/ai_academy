const fs = require('fs');
const httpStatus = require('http-status-codes');
const contentTypes = require('./contentTypes');

module.exports = {
  /**
   * Lit un fichier et renvoie son contenu dans la réponse
   */
  getFile: (filePath, res) => {
    fs.readFile(`./${filePath}`, (error, data) => {
      if (error) {
        res.writeHead(httpStatus.INTERNAL_SERVER_ERROR);
        res.end("Une erreur est survenue lors de la lecture du fichier.");
        return;
      }
      // Déterminer le type de contenu en fonction de l'extension du fichier
      const extension = filePath.split(".").pop();
      const contentType = contentTypes[extension] || contentTypes.text;
      res.writeHead(httpStatus.OK, contentType);
      res.end(data);
    });
  },

  /**
   * Collecte les données d'une requête POST
   */
  collectRequestData: (req, callback) => {
    let body = [];
    req.on("data", (bodyData) => {
      body.push(bodyData);
    });
    req.on("end", () => {
      body = Buffer.concat(body).toString();
      callback(body);
    });
  }
};
