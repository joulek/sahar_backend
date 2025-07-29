const BaseModel = require('../HUB/BaseModel');
const { executeQuery } = require("../config/database");
class contactModel extends BaseModel {
    constructor() {
        super('contact');
    }
    getBy = async (params) => {
        const { key, value } = params;
        return await executeQuery(
          `SELECT * FROM contact WHERE ${key} like "${value}" `
        ).then((rows) => rows[0]);
      };
}
module.exports = contactModel;