// config/db.js
const mysql = require('mysql2/promise')
require('dotenv').config()

// Create a connection pool
const db = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   // port: process.env.DB_PORT,
})

async function initializeDatabase() {
   try {
      // Test the pool with a simple query
      await db.query('SELECT 1')
      console.log('MySQL Connected')

      const sql = `
         CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            status VARCHAR(50) DEFAULT 'active',
            role VARCHAR(50) DEFAULT 'user',
            provider VARCHAR(50) DEFAULT 'email'
         )`

      // Execute the query to create the table if it doesn't exist
      await db.query(sql)
      console.log('Users table ensured!')
   } catch (err) {
      console.error(
         'Error connecting to the database or creating table:',
         err.message,
      )
   }
}

// Call the initialization function
initializeDatabase()

module.exports = db
