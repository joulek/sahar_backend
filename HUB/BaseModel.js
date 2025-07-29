const { executeQuery } = require("../config/database");
const { callPaginate } = require("../utils/pagination");
module.exports = class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }
  create = async (data) => {
    const res = await executeQuery(`INSERT INTO ${this.tableName} SET ? `, [
      data,
    ]);
    return await this.getBy({ key: "id", value: res.insertId });
  };
  paginate = async (request) => {
    let result = await callPaginate(request, `${this.tableName}`);
    return await prepareData(result, `${this.tableName}`);
  };

  getAll = async () => {
    return await executeQuery(`SELECT * FROM ${this.tableName} `);
  };
  getBy = async (params) => {
    const { key, value } = params;
    return await executeQuery(
      `SELECT * FROM ${this.tableName} WHERE ${key} like "${value}" `
    ).then((rows) => rows[0]);
  };
  update = async (data) => {
    const resUpdate = await executeQuery(
      `UPDATE ${this.tableName} SET ? WHERE id = ?`,
      [data, data.id]
    );
    if (resUpdate.affectedRows === 1)
      return await this.getBy({ key: "id", value: data.id });
    else throw new Error("Erreur de mise à jour de l'entité: " + data.id);
  };
  delete = async (id) => {
    const resDelete = await executeQuery(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    if (resDelete.affectedRows === 1) return resDelete;
    else throw new Error("Erreur lors de la suppression de l'entité: " + id);
  };
};
