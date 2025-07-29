const BaseController = require("../HUB/BaseController"); // ✅ IMPORT CORRECT
const pieceModel = require("../models/pieceModel");

module.exports = class pieceController extends BaseController {
  constructor() {
    super(new pieceModel());
  }

  getPieces = async (req, res) => {
    try {
      const piecesWithDetails = await this.model.getAllPieces();
      return res.status(200).json(piecesWithDetails);
    } catch (error) {
      console.error("❌ Erreur dans getPieces :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des pièces." });
    }
  };

  updatePrioritaire = async (req, res) => {
    try {
      const { id } = req.params;
      const { prioritaire } = req.body;

      if (!["High", "Medium", "Faible"].includes(prioritaire)) {
        return res.status(400).json({ error: "Valeur de priorité invalide." });
      }

      const result = await this.model.updatePrioritaire(id, prioritaire);
      return res.status(200).json({ message: `Priorité mise à jour pour la pièce ${id}`, result });
    } catch (error) {
      console.error("❌ Erreur dans updatePrioritaire :", error.message);
      return res.status(500).json({ error: "Erreur lors de la mise à jour de la priorité." });
    }
  };

 
};
