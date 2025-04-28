const User = require("../models/user");
const Course = require("../models/course");
const Subscriber = require("../models/subscriber");
const httpStatus = require("http-status-codes");
const jsonWebToken = require("jsonwebtoken");
const passport = require("passport");

const token_key = process.env.TOKEN_KEY || "secretTokenKey";

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
  verifyToken: (req, res, next) => {
    if (req.path === "/login") return next();

    let token = req.query.apiToken || req.headers.authorization;

    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }

      jsonWebToken.verify(token, token_key, (errors, payload) => {
        if (payload) {
          User.findById(payload.data).then(user => {
            if (user) {
              next();
            } else {
              res.status(httpStatus.FORBIDDEN).json({
                error: true,
                message: "Aucun compte utilisateur trouvé."
              });
            }
          });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json({
            error: true,
            message: "Impossible de vérifier le token API."
          });
        }
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: true,
        message: "Un token API est requis pour cette route."
      });
    }
  },

  apiAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        let signedToken = jsonWebToken.sign({
          data: user._id,
          exp: new Date().setDate(new Date().getDate() + 1)
        }, token_key);

        res.json({
          success: true,
          token: signedToken,
          user: {
            id: user._id,
            name: user.fullName,
            email: user.email
          }
        });
      } else {
        res.json({
          success: false,
          message: "Impossible d'authentifier l'utilisateur."
        });
      }
    })(req, res, next);
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals.data || res.locals
    });
  },

  errorJSON: (error, req, res, next) => {
    const errorObject = error ? {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    } : {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Erreur inconnue."
    };
    res.json(errorObject);
  },

  // Users
  getAllUsers: (req, res, next) => {
    User.find({})
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => next(error));
  },

  getUserById: (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => next(error));
  },

  createUser: (req, res, next) => {
    const userParams = getUserParams(req.body);
    User.register(new User(userParams), req.body.password)
      .then(user => {
        res.locals.user = user;
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  updateUser: (req, res, next) => {
    const userParams = getUserParams(req.body);
    User.findByIdAndUpdate(req.params.id, { $set: userParams })
      .then(user => {
        res.locals.user = user;
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  deleteUser: (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
      .then(() => {
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  // Courses
  getAllCourses: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => next(error));
  },

  getCourseById: (req, res, next) => {
    Course.findById(req.params.id)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => next(error));
  },

  createCourse: (req, res, next) => {
    const courseParams = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost
    };
    Course.create(courseParams)
      .then(course => {
        res.locals.course = course;
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  updateCourse: (req, res, next) => {
    const courseParams = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost
    };
    Course.findByIdAndUpdate(req.params.id, { $set: courseParams })
      .then(course => {
        res.locals.course = course;
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  deleteCourse: (req, res, next) => {
    Course.findByIdAndRemove(req.params.id)
      .then(() => {
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  // Subscribers
  getAllSubscribers: (req, res, next) => {
    Subscriber.find({})
      .then(subscribers => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch(error => next(error));
  },

  getSubscriberById: (req, res, next) => {
    Subscriber.findById(req.params.id)
      .then(subscriber => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch(error => next(error));
  },

  createSubscriber: (req, res, next) => {
    const subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };
    Subscriber.create(subscriberParams)
      .then(subscriber => {
        res.locals.subscriber = subscriber;
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  updateSubscriber: (req, res, next) => {
    const subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };
    Subscriber.findByIdAndUpdate(req.params.id, { $set: subscriberParams })
      .then(subscriber => {
        res.locals.subscriber = subscriber;
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  },

  deleteSubscriber: (req, res, next) => {
    Subscriber.findByIdAndRemove(req.params.id)
      .then(() => {
        res.locals.success = true;
        next();
      })
      .catch(error => next(error));
  }
};
