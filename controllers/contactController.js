const httpStatus = require('http-status-codes');
const utils = require('../utils');

module.exports = {
  getContact: (req, res) => {
    utils.getFile("views/contact.html", res);
  },

  submitContact: (req, res) => {
    utils.collectRequestData(req, (formData) => {
      console.log("Données du formulaire reçues:", formData);
      utils.getFile("views/thanks.html", res);
    });
  }
};
