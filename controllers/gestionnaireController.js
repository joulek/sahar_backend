const BaseController = require("../HUB/BaseController");
const gestionnaireModel = require("../models/gestionnaireModel");

module.exports = class gestionnaireController extends BaseController {
  constructor() {
    super(new gestionnaireModel());
  }

  createGestionnaire = async (req, res) => {
    try {
      const data = req.body;
      const response = await this.model.creategestionnaire(data);

      return res.status(201).json({
        message: response.message,
        gestionnaireId: response.gestionnaireId,
        utilisateurId: response.utilisateurId,
      });
    } catch (error) {
      console.error("❌ Erreur dans createGestionnaire :", error.message);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          error: "Ce CIN existe déjà dans la base de données.",
        });
      }

      return res.status(500).json({
        error: "Erreur interne lors de la création du gestionnaire.",
      });
    }
  };



  // ✅ Mettre à jour un gestionnaire et l'utilisateur lié
  updateGestionnaire = async (req, res) => {
    try {
      const { id } = req.params;    // ID dans l’URL
      const data = req.body;        // Données du corps

      const response = await this.model.updateGestionnaire(id, data);

      return res.status(200).json({
        message: response.message,
      });
    } catch (error) {
      console.error("❌ Erreur dans updateGestionnaire :", error.message);

      // 🔍 Si l’erreur concerne un CIN déjà utilisé ou invalide
      if (error.message.toLowerCase().includes("cin")) {
        return res.status(400).json({
          error: error.message,     // ex. « ❌ Ce CIN est déjà utilisé … »
        });
      }

      // 🟥 Autres erreurs (DB, inconnue, etc.)
      return res.status(500).json({
        error: "Erreur interne lors de la mise à jour du gestionnaire.",
      });
    }
  };


  // ✅ Supprimer un gestionnaire et l'utilisateur lié
  deleteGestionnaire = async (req, res) => {
    try {
      const { id } = req.params;  // Récupérer l'ID de l'URL

      const response = await this.model.deleteGestionnaire(id);

      return res.status(200).json({
        message: response.message,
      });
    } catch (error) {
      console.error("❌ Erreur dans deleteGestionnaire :", error.message);
      return res.status(500).json({ error: error.message });
    }
  };
};
