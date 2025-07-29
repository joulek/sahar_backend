const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sahar",
  connectionLimit: 10,
  timezone: "+01:00", // Set the timezone to Tunisia
  dateStrings: true, // Get dates as strings to preserve timestamps
});



async function createDatabaseIfNotExists() {
  const databaseName = process.env.DB_DATABASE || "new_look";
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName};`;
  const useDatabaseQuery = `USE ${databaseName};`;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true, // Enable multiple statements in a single query
    });

    // Create the database if it doesn't exist
    await connection.query(createDatabaseQuery);

    // Switch to the created database
    await connection.query(useDatabaseQuery);

    connection.end();
  } catch (error) {
    console.error("Error creating or using the database:", error);
    throw error;
  }
}

async function executeQuery(query, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = connection.format(query, params);
    if (process.env.QUERY_LOG === "true") {
      console.log("executed query: ", sql);
    }
    const [result] = await connection.query(sql);
    return result;
  } catch (error) {
    if (process.env.QUERY_LOG === "true") {
      console.error("error executing query: ", error.message);
    }
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


module.exports = {
  executeQuery, createDatabaseIfNotExists
};