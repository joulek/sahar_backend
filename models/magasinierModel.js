const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");

module.exports = class MagasinierModel extends BaseModel {
  constructor() {
    super("magasinier");
  }

  // Créer un magasinier et un utilisateur lié avec role = 'magasinier'
 async createMagasinier(data) {
  try {
    const insertMagasinierQuery = `
      INSERT INTO magasinier (nom, prenom, cin, numTel)
      VALUES (?, ?, ?, ?)
    `;
    const magasinierResult = await executeQuery(insertMagasinierQuery, [
      data.nom,
      data.prenom,
      data.cin,
      data.numTel,
    ]);
    const magasinierId = magasinierResult.insertId;

    const insertUtilisateurQuery = `
      INSERT INTO utilisateur (prenom, cin, role)
      VALUES (?, ?, ?)
    `;
    const utilisateurResult = await executeQuery(insertUtilisateurQuery, [
      data.nom,
      data.cin,
      "magasinier",
    ]);
    const utilisateurId = utilisateurResult.insertId;

    return {
      message: "Magasinier et utilisateur créés avec succès.",
      magasinierId,
      utilisateurId,
    };
  } catch (error) {
    console.error("❌ Erreur dans createMagasinier :", error.message);

    // ✅ Intercepter l’erreur MySQL "Duplicate entry"
    if (error.code === "ER_DUP_ENTRY" && error.message.toLowerCase().includes("cin")) {
      throw new Error("❌ Ce CIN est déjà utilisé. Veuillez en saisir un autre.");
    }

    // Pour les autres erreurs, relancer l’erreur générique
    throw new Error("Erreur lors de la création du magasinier et de l'utilisateur.");
  }
}


  async deleteMagasinier(magasinierId) {
  try {
    const getMagasinierQuery = `SELECT cin FROM magasinier WHERE id = ?`;
    const magasinierResult = await executeQuery(getMagasinierQuery, [
      magasinierId,
    ]);

    if (magasinierResult.length === 0) {
      throw new Error("Magasinier non trouvé.");
    }

    const cin = magasinierResult[0].cin;

    // Supprimer l'utilisateur lié
    const deleteUtilisateurQuery = `
      DELETE FROM utilisateur
      WHERE cin = ? AND role = 'magasinier'
    `;
    await executeQuery(deleteUtilisateurQuery, [cin]);

    // Supprimer le magasinier
    const deleteMagasinierQuery = `DELETE FROM magasinier WHERE id = ?`;
    await executeQuery(deleteMagasinierQuery, [magasinierId]);

    return {
      message: "Magasinier et utilisateur supprimés avec succès.",
    };
  } catch (error) {
    console.error("❌ Erreur dans deleteMagasinier :", error.message);
    throw new Error("Erreur lors de la suppression du magasinier et de l'utilisateur.");
  }
}


// Mettre à jour un magasinier
async updateMagasinier(id, data) {
  try {
    // Étape 1 : récupérer l'ancien cin
    const getOldCinQuery = `SELECT cin FROM magasinier WHERE id = ?`;
    const result = await executeQuery(getOldCinQuery, [id]);

    if (result.length === 0) {
      throw new Error("Magasinier non trouvé.");
    }

    const oldCin = result[0].cin;

    // Étape 2 : mettre à jour le magasinier
    const updateMagasinierQuery = `
      UPDATE magasinier
      SET nom = ?, prenom = ?, cin = ?, numTel = ?
      WHERE id = ?
    `;

    try {
      await executeQuery(updateMagasinierQuery, [
        data.nom,
        data.prenom,
        data.cin,
        data.numTel,
        id,
      ]);
    } catch (sqlError) {
      if (sqlError.code === "ER_DUP_ENTRY") {
        throw new Error("❌ Ce CIN est déjà utilisé. Veuillez en saisir un autre.");
      }
      throw sqlError; // relancer les autres erreurs
    }


    // Étape 3 : mettre à jour l'utilisateur lié via ancien CIN
    const updateUtilisateurQuery = `
      UPDATE utilisateur
      SET prenom = ?, cin = ?
      WHERE cin = ? AND role = 'magasinier'
    `;
    const updateResult = await executeQuery(updateUtilisateurQuery, [
      data.prenom,
      data.cin,
      oldCin,
    ]);

    if (updateResult.affectedRows === 0) {
      throw new Error("Utilisateur lié introuvable pour CIN : " + oldCin);
    }


    return { message: "Magasinier et utilisateur mis à jour avec succès." };
  } catch (error) {
    console.error("❌ Erreur dans updateMagasinier :", error.message);
    throw error; // Important : propager l’erreur exacte vers le contrôleur
  }
}

  
  // Récupérer tous les magasiniers
  async getAllMagasiniers() {
    try {
      const query = `SELECT * FROM magasinier`;
      const result = await executeQuery(query);
      return result;
    } catch (error) {
      console.error("❌ Erreur dans getAllMagasiniers :", error.message);
      throw new Error("Erreur lors de la récupération des magasiniers.");
    }
  }
};
