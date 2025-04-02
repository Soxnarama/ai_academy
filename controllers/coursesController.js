const httpStatus = require('http-status-codes');
const contentTypes = require('../contentTypes');
const utils = require('../utils');
const courses = require('../models/courses');
const url = require('url');


module.exports = {
  getCourses: (req, res) => {
    utils.getFile("views/courses.html", res);
  },

  getCoursesAPI: (req, res) => {
    res.writeHead(httpStatus.OK, contentTypes.json);
    res.end(JSON.stringify(courses));
 },

  getCourseById: (req, res, id) => {
    const course = courses.find(c => c.id === parseInt(id));
    if (course) {
      res.writeHead(httpStatus.OK, contentTypes.json);
      res.end(JSON.stringify(course));
    } else {
      res.writeHead(httpStatus.NOT_FOUND, contentTypes.json);
      res.end(JSON.stringify({ error: "Cours non trouvé" }));
    }
  },
  getCoursesByTitle: (req, res , title_book) => {
    const decodedTitle = decodeURIComponent(title_book);
    console.log("Decoded title:", decodedTitle);
    if (decodedTitle=="") {
        res.end(JSON.stringify({ error: "Titre non fourni" }));
        return;
    }

    const matchingCourses = courses.filter(course => 
        course.title.toLowerCase().includes(decodedTitle.toLowerCase())
    );
    console.log(matchingCourses);
    console.log(matchingCourses.length);
    if (matchingCourses.length > 0) {
        res.writeHead(httpStatus.OK, contentTypes.json);
        res.end(JSON.stringify(matchingCourses));
    } else {
        res.writeHead(httpStatus.NOT_FOUND, contentTypes.json);
        res.end(JSON.stringify({ error: "Aucun cours trouvé pour le titre donné." }));
    }
}

};
