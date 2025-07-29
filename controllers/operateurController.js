const BaseController = require("../HUB/BaseController");
const operateurModel = require("../models/operateurModel");
const operateurInstance = new operateurModel(); // nécessaire pour `getAll`

module.exports = class operateurController extends BaseController {
  constructor() {
    super(operateurInstance);
  }
  // ✅ Supprimer opérateur + utilisateur lié
  deleteOperateur = async (req, res) => {
    try {
      const { id } = req.params;

      const response = await this.model.deleteOperateur(id);

      return res.status(200).json({
        message: response.message,
      });
    } catch (error) {
      console.error("❌ Erreur dans deleteOperateur :", error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  // ✅ Créer opérateur + utilisateur
  createOperateur = async (req, res) => {
  try {
    const data = req.body;
    console.log("📥 Données reçues :", data);

    const response = await this.model.createOperateur(data);

    return res.status(201).json({
      message: response.message,
      operateurId: response.operateurId,
      utilisateurId: response.utilisateurId,
    });
  } catch (error) {
    console.error("❌ Erreur dans createOperateur :", error.message);

    // ✅ Gérer le cas du CIN déjà existant (message explicite pour le frontend)
    if (error.message.toLowerCase().includes("cin")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    // ❌ Erreur générique (base de données, connexion, etc.)
    return res.status(500).json({
      error: "Erreur interne lors de la création de l'opérateur.",
    });
  }
};

  // ✅ Mettre à jour opérateur + utilisateur
updateOperateur = async (req, res) => {
  try {
    const data = req.body;
    console.log("📦 Données reçues pour update :", data);

    const response = await this.model.updateOperateur(data);

    return res.status(200).json({
      message: response.message,
      operateurId: response.operateurId,
      utilisateurId: response.utilisateurId,
    });
  } catch (error) {
    console.error("❌ Erreur dans updateOperateur :", error.message);

    // 🔍 Erreur fonctionnelle : CIN déjà utilisé ou problème lié au CIN
    if (error.message.toLowerCase().includes("cin")) {
      return res.status(400).json({
        error: error.message,           // ex. « ❌ Ce CIN est déjà utilisé par un autre utilisateur. »
      });
    }

    // 🟥 Erreur générique (SQL, réseau, etc.)
    return res.status(500).json({
      error: "Erreur interne lors de la mise à jour de l'opérateur.",
    });
  }
};



  // ✅ Liste tous les opérateurs avec labels machine/procédé
  getAll = async (req, res) => {
    try {
      const operateurs = await operateurInstance.getAllOperateurs();
      return res.status(200).json(operateurs);
    } catch (error) {
      console.error("❌ Erreur dans getAll :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des opérateurs." });
    }
  };
  // 🔁 Retourner id_operateur à partir de id_utilisateur (via CIN)
getIdByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const operateurId = await this.model.getOperateurIdByUserId(id);

    if (operateurId) {
      return res.status(200).json({ id: operateurId });
    } else {
      return res.status(404).json({ message: "Aucun opérateur trouvé pour cet utilisateur." });
    }
  } catch (error) {
    console.error("❌ Erreur dans getIdByUserId :", error.message);
    return res.status(500).json({ error: "Erreur lors de la récupération de l'id opérateur." });
  }
};

};
