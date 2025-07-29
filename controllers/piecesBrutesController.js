const BaseController = require("../HUB/BaseController");
const piecesbrutesModel = require("../models/piecesBrutesModel");

module.exports = class piecesbrutesController extends BaseController {
  constructor() {
    super(new piecesbrutesModel());
  }

  // 🚀 Récupérer les pièces par nom de matériaux
  getByNomMateriau = async (req, res) => {
    try {
      const nom = req.params.nom;
      const data = await this.model.getByNomMateriau(nom);
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur getByNomMateriau:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  // 🚀 Récupérer toutes les pièces brutes avec NULL remplacé par "Non renseigné"
  getAllWithDefaultNullReplaced = async (req, res) => {
    try {
      const data = await this.model.getAllWithDefaultNullReplaced();
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur getAllWithDefaultNullReplaced:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  // ✅ Suppression d'une pièce brute
  delete = async (req, res) => {
    try {
      const id = req.params.id;
      await this.model.delete(id);
      res.status(200).json({ message: "Pièce brute supprimée avec succès." });
    } catch (error) {
      console.error("❌ Erreur suppression pièce brute :", error);
      res.status(500).json({ message: "Erreur lors de la suppression de la pièce brute." });
    }
  };

  delete = async (req, res) => {
  try {
    const id = req.params.id;
    await this.model.decrementOrDelete(id); // appel de la nouvelle méthode
    res.status(200).json({ message: "Opération effectuée avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression/décrémentation :", error);
    res.status(500).json({ message: "Erreur lors de l'opération." });
  }
};

};
