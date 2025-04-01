const httpStatus = require('http-status-codes');
const utils = require('../utils');

module.exports = {
  getIndex: (req, res) => {
    utils.getFile("views/index.html", res);
  },

  getAbout: (req, res) => {
    utils.getFile("views/about.html", res);
  },

  getError: (req, res) => {
    utils.getFile("views/error.html", res);
  }
};
