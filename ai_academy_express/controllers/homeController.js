// Données des cours (seront remplacées par une base de données plus tard)
const courses = [
    {
      title: "Introduction à l'IA",
      description: "Découvrez les fondamentaux de l'intelligence artificielle.",
      price: 199,
      level: "Débutant"
    },
    {
      title: "Machine Learning Fondamental",
      description: "Apprenez les principes du machine learning et les algorithmes de base.",
      price: 299,
      level: "Intermédiaire"
    },
    {
      title: "Deep Learning Avancé",
      description: "Maîtrisez les réseaux de neurones profonds et leurs applications.",
      price: 399,
      level: "Avancé"
    }
  ];

exports.index = (req, res) => {
  const flashMessages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };

  res.render("index", {
    pageTitle: "Accueil",
    messages: flashMessages
  });
};

exports.about = (req, res) => {
  const flashMessages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };

  res.render("about", {
    pageTitle: "À propos",
    messages: flashMessages
  });
};

exports.courses = (req, res) => {
  const { level, maxPrice } = req.query;
  let filteredCourses = [...courses]; // Crée une copie des cours pour ne pas altérer la donnée initiale

  if (level) {
    filteredCourses = filteredCourses.filter(course => course.level.toLowerCase() === level.toLowerCase());
  }

  if (maxPrice) {
    filteredCourses = filteredCourses.filter(course => course.price <= parseFloat(maxPrice));
  }

  const flashMessages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };

  res.render("courses", {
    pageTitle: "Nos Cours",
    courses: filteredCourses,
    selectedLevel: level || '',
    selectedPrice: maxPrice || '',
    messages: flashMessages
  });
};

exports.contact = (req, res) => {
  const flashMessages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };

  res.render("contact", {
    pageTitle: "Contact",
    messages: flashMessages
  });
};

exports.processContact = (req, res) => {
  const { name, email, course, message } = req.body;

  // Exemple de validation
  if (!name || !email) {
    req.flash("error", "Veuillez remplir tous les champs obligatoires.");
    return res.redirect("/contact");
  }
  
  if (message && message.length < 10) {
    req.flash("error", "Le message doit contenir au moins 10 caractères.");
    return res.redirect("/contact");
  }

  req.flash("success", "Message envoyé avec succès !");
  res.render("thanks", {
    pageTitle: "Merci",
    formData: req.body
  });
};

exports.faq = (req, res) => {
  const flashMessages = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };

  res.render("faq", {
    pageTitle: "FAQ",
    messages: flashMessages
  });
};
