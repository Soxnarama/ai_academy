const messages = require('./messages'); // Assurez-vous que le chemin est correct

const routes = {
    "/": {
        "GET": (req, res) => {
            return "<h1>Accueil de AI Academy</h1><p>Bienvenue sur notre plateforme d'apprentissage de l'IA!</p>";
        }
    },
    "/about": {
        "GET": (req, res) => {
            return "<h1>À propos de AI Academy</h1><p>Nous sommes une plateforme éducative dédiée à l'IA et au Machine Learning.</p>";
        }
    },
    "/courses": {
        "GET": (req, res) => {
            return `
                <h1>Nos cours</h1>
                <ul>
                    <li>Introduction à l'IA</li>
                    <li>Machine Learning</li>
                    <li>Deep Learning</li>
                    <li>Natural Language Processing</li>
                </ul>
            `;
        }
    },
    "/register": {
        "GET": (req, res) => {
            return `
                <h1>Inscription</h1>
                <form method="POST" action="/register">
                    <label>Nom: <input type="text" name="name" required></label><br>
                    <label>Email: <input type="email" name="email" required></label><br>
                    <label>Mot de passe: <input type="password" name="password" required></label><br>
                    <input type="submit" value="S'inscrire">
                </form>
            `;
        },
        "POST": (req, res, body) => {
            const params = new URLSearchParams(body);
            return `
                <h1>Inscription réussie!</h1>
                <p>Merci de vous être inscrit, ${params.get('name')}!</p>
                <p>Un email de confirmation a été envoyé à ${params.get('email')}.</p>
                <p><a href="/">Retour à l'accueil</a></p>
            `;
        }
    },
    "/api/messages": {
        "GET": (req, res) => {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(messages)); // Envoyer la réponse JSON
        }
    }
};

module.exports = routes;
