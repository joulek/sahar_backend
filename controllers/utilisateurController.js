// controllers/utilisateurController.js
const BaseController = require("../HUB/BaseController");
const utilisateurModel = require("../models/utilisateurModel");

module.exports = class utilisateurController extends BaseController {
  constructor() {
    super(new utilisateurModel());
  }

  login = async (req, res) => {
    try {
      const { prenom, cin } = req.body;  // Récupère le nom et le cin dans la requête
    
      // Appel à la méthode login du modèle pour vérifier l'utilisateur (méthode statique)
      const utilisateur = await utilisateurModel.login(prenom, cin);  // Appel correct à la méthode statique
    
      // Si l'utilisateur est trouvé, retourner les informations
      return res.status(200).json({
        message: "Connexion réussie",
        utilisateur,
      });
    } catch (error) {
      // Gérer les erreurs
      return res.status(400).json({ error: error.message });
    }
  };
};
