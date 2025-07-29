const multer = require('multer');

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Spécifier le répertoire de destination pour le téléchargement des fichiers
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique pour éviter les collisions
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Créer une instance de multer avec la configuration de stockage
const upload = multer({ storage: storage });

// Fonction pour télécharger un fichier et obtenir son URL
const uploadFileAndGetUrl = async (file) => {
  return new Promise((resolve, reject) => {
    // Utiliser multer pour télécharger le fichier
    upload.single('file')(file, null, async (err) => {
      if (err) {
        reject(err);
      } else {
        // Récupérer l'URL du fichier téléchargé
        const fileUrl = 'http://localhost:3000/' + file.path; // Exemple d'URL basique
        resolve(fileUrl);
      }
    });
  });
};

module.exports = uploadFileAndGetUrl;
