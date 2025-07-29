// 📁 controllers/piecefiniController.js
const BaseController = require("../HUB/BaseController");
const piecefiniModel = require("../models/piecefiniModel");

module.exports = class piecefiniController extends BaseController {
  constructor() {
    super(new piecefiniModel());
  }

  getAllPieces = async (req, res) => {
    try {
      const pieces = await this.model.getAll();
      res.json(pieces);
    } catch (error) {
      console.error("❌ Erreur lors du fetch :", error.message);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  updateValidated = async (req, res) => {
    const { id } = req.params;
    const { validated } = req.body;

    try {
      await this.model.updateValidated(id, validated);
      res.json({ success: true });
    } catch (error) {
      console.error("❌ Erreur updateValidated :", error.message);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  // 📊 Méthodes KPI

getTotalPieces = async (req, res) => {
  try {
    const mois = parseInt(req.query.mois);
    const annee = parseInt(req.query.annee) || new Date().getFullYear();

    if (!mois || mois < 1 || mois > 12) {
      return res.status(400).json({ error: "❌ Mois invalide" });
    }

    console.log("📥 Requête total pièces - Mois:", mois, "Année:", annee);

    const result = await this.model.getTotalPieces(mois, annee);

    console.log("📊 Résultat total pièces :", result);

    res.json(result[0]);
  } catch (error) {
    console.error("❌ Erreur total pièces :", error);
    res.status(500).json({ error: "Erreur lors du comptage des pièces" });
  }
};


getNbPiecesValidees = async (req, res) => {
  try {
    const mois = parseInt(req.query.mois);
    const annee = parseInt(req.query.annee) || new Date().getFullYear();

    if (!mois || mois < 1 || mois > 12) {
      return res.status(400).json({ error: "❌ Mois invalide" });
    }

    console.log("📥 Requête total pièces - Mois:", mois, "Année:", annee);

    const result = await this.model.getNbPiecesValidees(mois, annee);

    console.log("📊 Résultat total pièces :", result);

    res.json(result[0]);
  } catch (error) {
    console.error("❌ Erreur total pièces :", error);
    res.status(500).json({ error: "Erreur lors du comptage des pièces" });
  }
};


getNbPiecesNonValidees = async (req, res) => {
  try {
    const mois = req.query.mois; // extrait le mois depuis l'URL
    const result = await this.model.getNbPiecesNonValidees(mois);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du comptage des pièces non validées" });
  }
};

getValidatedStatsByDay = async (req, res) => {
  try {
    const date = req.query.date;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "❌ Date invalide (format YYYY-MM-DD attendu)" });
    }

    const result = await this.model.getValidatedStatsByDay(date);
    res.json(result);
  } catch (error) {
    console.error("❌ Erreur statistiques validation par jour :", error);
    res.status(500).json({ error: "Erreur statistiques validation par jour" });
  }
};



  getPrioriteRepartition = async (req, res) => {
    try {
      const result = await this.model.getPrioriteRepartition();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erreur répartition des priorités" });
    }
  };

  getPiecesTermineesDansLeTemps = async (req, res) => {
    try {
      const result = await this.model.getPiecesTermineesDansLeTemps();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erreur progression des pièces terminées" });
    }
  };
getNbPiecesParClient = async (req, res) => {
  try {
    const mois = parseInt(req.query.mois);
    const annee = parseInt(req.query.annee);

    if (!mois || !annee) {
      return res.status(400).json({ error: "Paramètres mois et année requis" });
    }

    const result = await this.model.getNbPiecesParClient(mois, annee);
    res.json(result);
  } catch (error) {
    console.error("❌ Erreur getNbPiecesParClient :", error);
    res.status(500).json({ error: "Erreur comptage pièces par client" });
  }
};


 getDernieresPiecesFabriquees = async (req, res) => {
  try {
    const data = await this.model.getDernieresPiecesFabriquees();
    res.json(data);
  } catch (error) {
    console.error("❌ Erreur getDernieresPiecesFabriquees :", error.message); // ✅ très utile
    res.status(500).json({ error: "Erreur serveur" });
  }
};


  getSuiviTempsFabrication = async (req, res) => {
    try {
      const result = await this.model.getSuiviTempsFabrication();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erreur suivi temps fabrication" });
    }
  };

  tauxretour = async (req, res) => {
    try {
      const result = await this.model.tauxretour();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erreur suivi temps fabrication" });
    }
  }; 
  tauxParMois = async (req, res) => {
  try {
    const result = await this.model.tauxParMois();
    res.json(result); // ✅ ceci doit retourner un tableau
  } catch (error) {
    console.error("❌ Erreur tauxParMois:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};




};
