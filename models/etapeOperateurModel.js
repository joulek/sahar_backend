const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database"); // ✅ OBLIGATOIRE
module.exports = class etapeOperateurModel extends BaseModel {
  constructor() {
    super("etape_operateur");
  }
  nombretotaletapeoperateur = async (date) => {
    console.log("📅 Filtre date opérateur :", date);

    return await executeQuery(`
    SELECT o.nom AS operateur,
           COUNT(*) AS total_etapes
    FROM etape_operateur eo
    JOIN operateur o ON eo.id_operateur = o.id
    WHERE DATE(eo.cree_le) = ?
    GROUP BY eo.id_operateur
    ORDER BY total_etapes DESC;
  `, [date]);
  };

  // etapeOperateurModel.js
  nombretotalDureoperateur = async (date) => {
    return await executeQuery(`
    SELECT 
      o.nom AS operateur,
      SEC_TO_TIME(SUM(TIME_TO_SEC(eo.duree_estimee))) AS total_duree
    FROM etape_operateur eo
    JOIN operateur o ON eo.id_operateur = o.id
    WHERE DATE(eo.cree_le) = ?       
    GROUP BY eo.id_operateur
    ORDER BY total_duree DESC
  `, [date]);
  };

}
