const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");

module.exports = class machineModel extends BaseModel {
  constructor() {
    super("machine");
  }
async saveMachine(data) {
  try {
    if (!data.id && (!data.maintenance || data.maintenance === "")) {
      // Insertion manuelle au lieu de super.create()
      const insertQuery = `
        INSERT INTO machine (label, reference, cree_le, modif_le)
        VALUES (?, ?, NOW(), NOW())
      `;
      const insertParams = [data.label, data.reference];

      const result = await executeQuery(insertQuery, insertParams);

      return {
        message: "✅ Machine ajoutée avec succès",
        id: result.insertId,
      };
    }

    if (data.id && data.maintenance) {
      const updateQuery = `
        UPDATE machine SET 
          maintenance = ?, 
          modif_le = NOW()
        WHERE id = ?
      `;
      const updateParams = [data.maintenance, data.id];
      await executeQuery(updateQuery, updateParams);

      return {
        message: "✅ Date de maintenance mise à jour avec succès",
      };
    }

    return { message: "⚠️ Données insuffisantes" };

  } catch (error) {
    // ✅ Interception du doublon sur la clé unique "reference"
    if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("unique_reference")) {
      throw new Error("🚫 Cette référence existe déjà, veuillez en saisir une autre.");
    }

    console.error("❌ Erreur SQL inattendue :", error);
    throw new Error("❌ Erreur lors de l'enregistrement de la machine");
  }
}



};
