const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require('express-fileupload');
const path = require('path');

const { createDatabaseIfNotExists } = require('./config/database');
const UserController = require('./controllers/userController'); // Assurez-vous que ce fichier existe

const app = express();
const PORT = process.env.PORT || 3005;

// Configuration du middleware
app.use(bodyParser.json()); // Analyser les corps JSON

// Options CORS
const corsOptions = {
  origin: ["http://localhost:3000"], // Remplacez par les origines autorisées
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Middleware CORS
app.use(cors(corsOptions));

// Routes
app.use("/clients", require("./routes/client.routes"));
app.use("/procedes", require("./routes/procede.routes"));
app.use("/machines", require("./routes/machine.routes"));
app.use("/operateur", require("./routes/operateur.routes"));
app.use("/utilisateur", require("./routes/utilisateur.routes"));
app.use("/materiaux", require("./routes/materiaux.routes"));
app.use("/pieceb", require("./routes/pieces.brutes.routes"));
app.use("/pieces", require("./routes/piece.routes"));
app.use("/piecesfini", require("./routes/piece.fini.routes"));
app.use("/gestionnaire", require("./routes/gestionnaire.routes"));
app.use("/piecevalide", require("./routes/piecevalide.routes"));
app.use("/piecerejeter", require("./routes/pieceRejeter.routes"));
app.use("/gamme", require("./routes/gammeusinage.routes"));
app.use("/etapeOperateur", require("./routes/etapeOperateur.routes"));
app.use("/etapetechnique", require("./routes/etapetechnique.routes"));
app.use("/tauxparmois", require("./routes/piece.fini.routes"));



app.use("/outillage", require("./routes/outiage.routes"));
app.use("/magasinier", require("./routes/magasinier.routes"));




app.use(fileupload());
app.post('/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('Aucun fichier n\'a été téléchargé.');
    }

    // Le nom de l'entrée de fichier dans la requête est déterminé par le champ de formulaire d'envoi du fichier
    let uploadedFile = req.files.uploadedFile;

    // Vérifier si le fichier a bien été téléchargé
    if (!uploadedFile) {
      return res.status(400).send('Aucun fichier n\'a été téléchargé.');
    }

    // Déplacer le fichier vers le répertoire de stockage (uploads)
    uploadedFile.mv(path.join(__dirname, 'uploads', uploadedFile.name), (err) => {
      if (err) {
        console.error('Erreur lors du déplacement du fichier :', err);
        return res.status(500).send('Une erreur est survenue lors du téléchargement du fichier.');
      }

      res.send('Fichier téléchargé avec succès !');
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la requête de téléchargement de fichier :', error);
    res.status(500).send('Une erreur est survenue lors du traitement de la requête de téléchargement de fichier.');
  }
});


async function startServer() {
  let connected = false;
  while (!connected) {
    try {
      await createDatabaseIfNotExists();
      console.log("La base de données est prête.");
      connected = true; // La connexion a réussi, donc on sort de la boucle
    } catch (error) {
      console.error("Erreur lors de la configuration de la base de données :", error);
      console.log("Merci de vérifier si XAMPP est activé ou si d'autres problèmes de connexion sont présents.");
      console.log("Tentative de reconnexion dans 5 secondes...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes avant de réessayer
    }
  }
}

// Démarrage du serveur
app.listen(PORT, () => {
  startServer(); // Appeler startServer après l'écoute
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${PORT}`);
});
