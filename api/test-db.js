const { query } = require('./db')

async function testConnection() {
  try {
    const result = await query(`
      SELECT
        DB_NAME() AS DatabaseName,
        COUNT(*) AS CustomerCount
      FROM Customers
    `)

    console.log('SQL Server connection: OK')
    console.log(result)
  } catch (error) {
    console.error('SQL Server connection: ERROR')
    console.error(error.message)
  }
}

testConnection()
