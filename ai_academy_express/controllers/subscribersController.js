const Subscriber = require("../models/subscriber");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
    .exec()
    .then(subscribers => {
      res.render("subscribers/index", {
        subscribers: subscribers
      });
    })
    .catch(error => {
      console.log(`Erreur lors de la récupération des abonnés: ${error.message}`);
      next(error);
    });
};

exports.getSubscriptionPage = (req, res) => {
  res.render("subscribers/new");
};

exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  newSubscriber.save()
    .then(result => {
      res.render("subscribers/thanks");
    })
    .catch(error => {
      if (error) res.send(error);
    });
};

exports.show = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findById(subscriberId)
    .then(subscriber => {
      res.render("subscribers/show", {
        subscriber: subscriber
      });
    })
    .catch(error => {
      console.log(`Erreur lors de la récupération d'un abonné par ID: ${error.message}`);
      next(error);
    });
};
// Fonction pour supprimer un abonné
exports.deleteSubscriber = async (req, res) => {
    try {
      const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
      if (!subscriber) {
        return res.status(404).send('Abonné non trouvé');
      }
      res.redirect('/subscribers');  // Redirige vers la page des abonnés après suppression
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la suppression');
    }
  };
  // Afficher le formulaire de modification d'un abonné
// Afficher le formulaire de modification d'un abonné
exports.editSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        res.render('subscribers/editSubscriber', { subscriber });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement de l\'abonné');
    }
};

// Traiter la modification de l'abonné
exports.updateSubscriber = async (req, res) => {
    try {
        const { name, email, zipCode } = req.body;

        // Validation simple
        if (!name || !email || !zipCode) {
            return res.render('subscribers/edit', {
                subscriber: req.body,
                error: 'Tous les champs doivent être remplis.'
            });
        }

        const updatedSubscriber = await Subscriber.findByIdAndUpdate(req.params.id, {
            name,
            email,
            zipCode
        }, { new: true });

        res.redirect('/subscribers'); // Redirige vers la liste des abonnés après la mise à jour
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour de l\'abonné');
    }
};

// Fonction pour rechercher des abonnés
exports.searchSubscribers = async (req, res) => {
    const { searchTerm } = req.query;
    console.log('Term de recherche:', searchTerm);
  
    try {
      // Vérifie si searchTerm est un nombre pour zipCode
      const searchTermIsNumber = !isNaN(searchTerm);
      const searchConditions = {
        $or: [
          { name: new RegExp(searchTerm, 'i') }, // Recherche par nom (en utilisant RegExp)
        ]
      };
  
      // Si searchTerm est un nombre, ajoute une condition pour le zipCode
      if (searchTermIsNumber) {
        searchConditions.$or.push({ zipCode: searchTerm });
      }
  
      const subscribers = await Subscriber.find(searchConditions);
  
      if (subscribers.length === 0) {
        console.log('Aucun abonné trouvé');
      }
  
      res.render('subscribers', { subscribers });
    } catch (err) {
      console.error('Erreur lors de la recherche d\'abonnés:', err);
      res.status(500).send('Erreur lors de la recherche d\'abonnés');
    }
  };
  
  
  

