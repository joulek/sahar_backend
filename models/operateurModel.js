const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");
const utilisateurModel = require("./utilisateurModel");
const utilisateurInstance = new utilisateurModel();

module.exports = class operateurModel extends BaseModel {
  constructor() {
    super("operateur");
  }

  // ✅ Créer opérateur + utilisateur lié
  createOperateur = async (data) => {

    try {
      const operateur = await this.create(data);

      const utilisateur = await utilisateurInstance.createFromOperateur(operateur);

      return {
        message: "Opérateur et utilisateur créés avec succès.",
        operateurId: operateur.id,
        utilisateurId: utilisateur.id,
      };
    } catch (error) {

      // ✅ Cas d’erreur : CIN déjà utilisé (clé unique dupliquée)
      if (error.code === "ER_DUP_ENTRY" && error.message.toLowerCase().includes("cin")) {
        throw new Error("❌ Ce CIN est déjà utilisé. Veuillez en saisir un autre.");
      }

      throw new Error("Erreur lors de la création de l'opérateur et de l'utilisateur.");
    }
  };

  // ✅ Mettre à jour opérateur + utilisateur lié
  // ✅ Mettre à jour opérateur + utilisateur lié
  updateOperateur = async (data) => {

    try {
      const { id } = data;

      // 🔍 Récupérer l'ancien CIN
      const oldCinQuery = `SELECT cin FROM operateur WHERE id = ?`;
      const result = await executeQuery(oldCinQuery, [id]);
      const oldCin = result?.[0]?.cin;

      if (!oldCin) throw new Error("Opérateur introuvable.");

      // ✅ Mise à jour opérateur (avec gestion de duplication CIN)
      try {
        const updatedOperateur = await this.update(data);
      } catch (sqlError) {
        if (
          sqlError.message.toLowerCase().includes("duplicate") &&
          sqlError.message.toLowerCase().includes("cin")
        ) {
          throw new Error("❌ Ce CIN est déjà utilisé par un autre utilisateur.");
        }
        throw sqlError; // relancer toute autre erreur SQL
      }

      // ✅ Mise à jour utilisateur lié via ancien CIN
      const updateUtilisateurQuery = `
      UPDATE utilisateur
      SET prenom = ?, cin = ?
      WHERE cin = ? AND role = 'technicien'
    `;
      const resultUpdate = await executeQuery(updateUtilisateurQuery, [
        data.prenom,
        data.cin,
        oldCin,
      ]);

      if (resultUpdate.affectedRows === 0) {
        throw new Error("Utilisateur lié introuvable pour CIN : " + oldCin);
      }


      return {
        message: "Opérateur et utilisateur mis à jour avec succès.",
      };
    } catch (error) {
      console.error("❌ Erreur dans updateOperateur :", error.message);

      // 🟠 Propagation du message explicite
      throw new Error(error.message || "Erreur lors de la mise à jour de l'opérateur.");
    }
  };


  // ✅ Supprimer opérateur + utilisateur lié
  deleteOperateur = async (operateurId) => {
    try {
      const getCinQuery = `SELECT cin FROM operateur WHERE id = ?`;
      const result = await executeQuery(getCinQuery, [operateurId]);

      if (result.length === 0) {
        throw new Error("Opérateur non trouvé.");
      }

      const cin = result[0].cin;

      const deleteUtilisateurQuery = `
        DELETE FROM utilisateur WHERE cin = ? AND role = 'technicien'
      `;
      await executeQuery(deleteUtilisateurQuery, [cin]);

      const deleteOperateurQuery = `DELETE FROM operateur WHERE id = ?`;
      await executeQuery(deleteOperateurQuery, [operateurId]);

      return {
        message: "Opérateur et utilisateur supprimés avec succès.",
      };
    } catch (error) {
      console.error("❌ Erreur dans deleteOperateur :", error.message);
      throw new Error("Erreur lors de la suppression de l'opérateur et de l'utilisateur.");
    }
  };

  // ✅ Liste opérateurs
  getAllOperateurs = async () => {
    const sql = `
      SELECT o.id, o.nom, o.prenom, o.cin, o.id_machine, o.id_procede,
             m.reference AS machineLabel, p.label AS procedeLabel
      FROM operateur o
      LEFT JOIN machine m ON o.id_machine = m.id
      LEFT JOIN procede p ON o.id_procede = p.id
    `;
    return await executeQuery(sql);
  };

  // ✅ Récupérer ID opérateur depuis l'utilisateur lié
  getOperateurIdByUserId = async (id_utilisateur) => {
    const query = `
      SELECT o.id
      FROM operateur o
      JOIN utilisateur u ON o.cin = u.cin
      WHERE u.id = ?
    `;
    const result = await executeQuery(query, [id_utilisateur]);
    return result[0]?.id || null;
  };
};
