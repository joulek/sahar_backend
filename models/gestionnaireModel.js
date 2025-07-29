const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database"); // ✅ Corrigé ici
const utilisateurModel = require("./utilisateurModel");
const utilisateurInstance = new utilisateurModel();

module.exports = class operateurModel extends BaseModel {
  constructor() {
    super("gestionnaire");
  }

async creategestionnaire(data) {
  try {
    // 1. Insérer dans la table gestionnaire
    const insertgestionnaireQuery = `
      INSERT INTO gestionnaire (nom, prenom, cin, numTel)
      VALUES (?, ?, ?, ?)
    `;
    const gestionnaireResult = await executeQuery(insertgestionnaireQuery, [
      data.nom,
      data.prenom,
      data.cin,
      data.numTel,
    ]);
    const gestionnaireId = gestionnaireResult.insertId;

    // 2. Insérer dans la table utilisateur avec le rôle 'gestionnaire'
    const insertUtilisateurQuery = `
      INSERT INTO utilisateur (prenom, cin, role)
      VALUES (?, ?, ?)
    `;
    const utilisateurResult = await executeQuery(insertUtilisateurQuery, [
      data.prenom,
      data.cin,
      "gestionnaire",
    ]);
    const utilisateurId = utilisateurResult.insertId;

    return {
      message: "Gestionnaire et utilisateur créés avec succès.",
      gestionnaireId,
      utilisateurId,
    };
  } catch (error) {
    // 🎯 Gérer l’erreur Duplicate Entry
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("unique_cin")) {
        throw new Error("❌ Ce CIN est déjà utilisé. Veuillez en saisir un autre.");
      }
    }

    console.error("❌ Erreur dans creategestionnaire :", error.message);
    throw new Error("Erreur lors de la création du gestionnaire et de l'utilisateur.");
  }
}

async updateGestionnaire(id, data) {
  try {
    // 1. Vérifier l'unicité du nouveau CIN
    const checkCinQuery = `SELECT id FROM gestionnaire WHERE cin = ? AND id != ?`;
    const existing = await executeQuery(checkCinQuery, [data.cin, id]);

    if (existing.length > 0) {
      throw new Error("❌ Ce CIN est déjà utilisé par un autre gestionnaire.");
    }

    // 2. Récupérer l'ancien CIN
    const getOldCinQuery = `SELECT cin FROM gestionnaire WHERE id = ?`;
    const oldResult = await executeQuery(getOldCinQuery, [id]);
    const oldCin = oldResult?.[0]?.cin;

    if (!oldCin) {
      throw new Error("Ancien CIN introuvable pour le gestionnaire.");
    }

    // 3. Mettre à jour le gestionnaire
    const updateGestionnaireQuery = `
      UPDATE gestionnaire
      SET nom = ?, prenom = ?, cin = ?, numTel = ?
      WHERE id = ?
    `;
    await executeQuery(updateGestionnaireQuery, [
      data.nom,
      data.prenom,
      data.cin,
      data.numTel,
      id,
    ]);

    // 4. Mettre à jour l'utilisateur lié
    const updateUtilisateurQuery = `
      UPDATE utilisateur
      SET prenom = ?, cin = ?
      WHERE cin = ? AND role = 'gestionnaire'
    `;
    const result = await executeQuery(updateUtilisateurQuery, [
      data.prenom,
      data.cin,
      oldCin,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("Utilisateur lié introuvable pour CIN : " + oldCin);
    }


    return {
      message: "Gestionnaire et utilisateur mis à jour avec succès.",
    };
  } catch (error) {
    console.error("❌ Erreur dans updateGestionnaire :", error.message);
    throw new Error(error.message || "Erreur lors de la mise à jour du gestionnaire et de l'utilisateur.");
  }
}



  async deleteGestionnaire(id) {
  try {
    // 1. Récupérer le CIN depuis la table gestionnaire
    const getCinQuery = `SELECT cin FROM gestionnaire WHERE id = ?`;
    const result = await executeQuery(getCinQuery, [id]);

    if (result.length === 0) {
      throw new Error("Gestionnaire non trouvé.");
    }

    const cin = result[0].cin;

    // 2. Supprimer l'utilisateur lié
    const deleteUtilisateurQuery = `
      DELETE FROM utilisateur
      WHERE cin = ? AND role = 'gestionnaire'
    `;
    await executeQuery(deleteUtilisateurQuery, [cin]);

    // 3. Supprimer le gestionnaire
    const deleteGestionnaireQuery = `
      DELETE FROM gestionnaire
      WHERE id = ?
    `;
    await executeQuery(deleteGestionnaireQuery, [id]);

    return {
      message: "Gestionnaire et utilisateur supprimés avec succès.",
    };
  } catch (error) {
    console.error("❌ Erreur dans deleteGestionnaire :", error.message);
    throw new Error("Erreur lors de la suppression du gestionnaire et de l'utilisateur.");
  }
}

};
