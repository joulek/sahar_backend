const BaseController = require("../HUB/BaseController");
const etapetechniqueModel = require("../models/etapetechniqueModel");

module.exports = class etapetechniqueController extends BaseController {
  constructor() {
    super(new etapetechniqueModel());
  }
  createEtape = async (req, res) => {
    try {
      const data = req.body;
      const result = await this.model.createEtape(data);
      return res.status(201).json(result);
    } catch (error) {
      console.error("❌ Erreur dans createEtape :", error);

      if (error.code === 'ER_DUP_ENTRY') {
        const sqlMsg = error.sqlMessage || "";

        if (sqlMsg.includes('uniq_gamme_procede')) {
          return res.status(400).json({
            error: "🚫 Ce procédé est déjà utilisé pour cette gamme.",
            details: "procédé_existant" // Ajout pour identification facile
          });
        }

        if (sqlMsg.includes('uniq_gamme_ordre')) {
          return res.status(400).json({
            error: "🚫 Cet ordre est déjà défini pour cette gamme.",
            details: "ordre_existant"
          });
        }
      }

      // Pour les autres erreurs du modèle
      if (error.message.includes("🚫")) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Erreur lors de la création de l'étape technique.",
        originalError: error.message // Ajout pour debug
      });
    }
  };

  getEtapesByOperateur = async (req, res) => {
    try {
      const { id_operateur } = req.params;
      const etapes = await this.model.getByOperateur(id_operateur);
      return res.status(200).json(etapes);
    } catch (error) {
      console.error("❌ Erreur dans getEtapesByOperateur :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des étapes par opérateur." });
    }
  };

  getEtape = async (req, res) => {
    try {
      const etapes = await this.model.getAllEtapes();
      return res.status(200).json(etapes);
    } catch (error) {
      console.error("❌ Erreur dans getAllPieces :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des pièces." });
    }
  };

  getEtapesByGamme = async (req, res) => {
    try {
      const { id_gamme } = req.params;
      const etapes = await this.model.getByGamme(id_gamme);
      return res.status(200).json(etapes);
    } catch (error) {
      console.error("❌ Erreur dans getEtapesByGamme :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des étapes par gamme." });
    }
  };

  getEtapeDisponiblePourProfession = async (req, res) => {
    try {
      const { id_utilisateur } = req.params;
      const etape = await this.model.getEtapeDisponiblePourProfession(id_utilisateur);
      return res.status(200).json(etape);
    } catch (error) {
      console.error("❌ Erreur dans getEtapeDisponiblePourProfession :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération de l’étape disponible." });
    }
  };

  updateEtatEtape = async (req, res) => {
    try {
      const { id } = req.params;
      const { etat } = req.body;
      const updatedEtape = await this.model.updateEtat(id, etat);
      return res.status(200).json(updatedEtape);
    } catch (error) {
      console.error("❌ Erreur dans updateEtatEtape :", error.message);
      return res.status(500).json({ error: "Erreur lors de la mise à jour de l'état de l'étape." });
    }
  };

  ajouterEstimationEtTerminer = async (req, res) => {
    try {
      const { id_etape, id_operateur, duree_estimee } = req.body;
      const result = await this.model.ajouterEstimationEtTerminer(id_etape, id_operateur, duree_estimee);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Erreur dans ajouterEstimationEtTerminer :", error.message);
      return res.status(500).json({ error: "Erreur lors de l’enregistrement de l’estimation." });
    }
  };
  updateEtatEtape = async (req, res) => {
    try {
      const { id } = req.params;
      const { etat } = req.body;
      const updatedEtape = await this.model.updateEtat(id, etat);
      return res.status(200).json(updatedEtape);
    } catch (error) {
      console.error("❌ Erreur dans updateEtatEtape :", error.message);
      return res.status(500).json({ error: "Erreur lors de la mise à jour de l'état de l'étape." });
    }
  };

  verifierEtInsererPieceFini = async (req, res) => {
    try {
      const { id_etape } = req.params; // ou req.body selon ton appel
      if (!id_etape) {
        return res.status(400).json({ message: "ID étape manquant." });
      }

      await etapeModel.verifierEtInsererPieceFini(id_etape);

      return res.status(200).json({ message: "Vérification et insertion effectuée si nécessaire." });
    } catch (error) {
      console.error("❌ Erreur dans le contrôleur verifierEtInsererPieceFini :", error);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
  };
  repartitionpiece = async (req, res) => {
    try {
      const result = await this.model.repartitionpiece();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erreur suivi temps fabrication" });
    }
  };
};
