const { executeQuery } = require("../config/database");
const {
  SQL_REQUEST_Foreign_Keys,
  SQL_REQUEST_Tables_Ref,
  SQL_REQUEST_Foreign_Keys2,
} = require("./dataBaseRequests");
const { ValidateObject } = require("./tests");

replaceForeignKeyValues = async (result, tableName) => {
  let items_fk = await executeQuery(SQL_REQUEST_Foreign_Keys, [tableName]);
  if (!(await ValidateObject(items_fk)) || !(await ValidateObject(result))) {
    return result;
  }

  // replaceForeignKeyValues = async (result, items_fk) => {
  // Vérifier si result et items_fk sont des tableaux non vides

  if (
    !Array.isArray(result) ||
    !result.length ||
    !Array.isArray(items_fk) ||
    !items_fk.length
  ) {
    throw new Error("Les arguments ne sont pas des tableaux non vides.");
  }
  // Parcourir chaque ligne dans result
  for (let i = 0; i < result.length; i++) {
    const row = result[i];
    // Parcourir chaque élément dans items_fk
    for (let j = 0; j < items_fk.length; j++) {
      const fk = items_fk[j];
      // Vérifier si la ligne contient une colonne correspondant à une clé étrangère
      if (fk.COLUMN_NAME in row) {
        // Remplacer la valeur par l'objet correspondant de la table référencée
        const referencedTable = await getReferencedTableRow(
          fk.REFERENCED_TABLE_NAME,
          row[fk.COLUMN_NAME]
        );
        result[i][fk.COLUMN_NAME] = referencedTable;
      }
    }
  }
  return result;
};

getReferencedTableRow = async (tableName, id) => {
  const query = `SELECT * FROM ${tableName} WHERE id = ?`;
  const result = await executeQuery(query, [id]);
  return result[0];
};

prepareData = async (object, tableName) => {
  let items_fk = await executeQuery(SQL_REQUEST_Tables_Ref, [tableName]);
  if (
    !(await ValidateObject(items_fk)) ||
    !(await ValidateObject(object.items))
  ) {
    return object;
  }

  if (
    !Array.isArray(object.items) ||
    !object.items.length ||
    !Array.isArray(items_fk) ||
    !items_fk.length
  ) {
    throw new Error("Les arguments ne sont pas des tableaux non vides.");
  }

  for (let index = 0; index < items_fk.length; index++) {
    let TABLE_NAME = items_fk[index]["TABLE_NAME"];
    let items_fk2 = await executeQuery(
      SQL_REQUEST_Foreign_Keys + " AND REFERENCED_TABLE_NAME != ?",
      [TABLE_NAME, tableName]
    );
    if (await ValidateObject(items_fk2)) {
      let COLUMN_NAME = items_fk2[0]["COLUMN_NAME"];
      let REFERENCED_TABLE_NAME = items_fk2[0]["REFERENCED_TABLE_NAME"];

      for (let index = 0; index < object.items.length; index++) {
        let result = await executeQuery(
          `SELECT * FROM ${REFERENCED_TABLE_NAME} WHERE id IN (SELECT ${COLUMN_NAME} FROM ${TABLE_NAME} WHERE id_service = ?)`,
          object.items[index].id
        );
        if (result && result.length !== 0) {
        object.items[index][REFERENCED_TABLE_NAME] = result;
        }
      }
    }
  }
  return object;
};

module.exports = { replaceForeignKeyValues, prepareData };
