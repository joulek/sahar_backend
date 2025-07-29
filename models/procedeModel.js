const BaseModel=require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");
module.exports=class procedeModel extends BaseModel{
  constructor() {
    super("procede");
  }
  async getAllprocede() {
    try {
      const query = `
        SELECT * from procede;
      `;
      const results = await executeQuery(query);
      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des procedes : ", error);
      throw error;
    }
  }
}
