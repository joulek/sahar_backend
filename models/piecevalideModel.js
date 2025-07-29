const BaseModel=require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");
module.exports=class piecevalideModel extends BaseModel{
  constructor() {
    super("piece_valide");
  }
  getAll = async () => {
    const query = `
      SELECT 
        pf.*, 
        c.nomComplet AS nom_client
      FROM piece_valide pf
      JOIN clients c ON pf.id_client = c.id
    `;
    return await executeQuery(query);
  };

}
