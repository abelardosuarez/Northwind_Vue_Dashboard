require('dotenv').config()

const odbc = require('msnodesqlv8')

const connectionString =
  `Driver={ODBC Driver 18 for SQL Server};` +
  `Server=${process.env.DB_SERVER};` +
  `Database=${process.env.DB_DATABASE};` +
  `Trusted_Connection=Yes;` +
  `TrustServerCertificate=Yes;`

function query(sqlQuery) {
  return new Promise((resolve, reject) => {
    odbc.open(connectionString, (error, connection) => {
      if (error) {
        reject(error)
        return
      }

      connection.query(sqlQuery, (error, result) => {
        connection.close()

        if (error) {
          reject(error)
          return
        }

        resolve(result)
      })
    })
  })
}

module.exports = {
  query
}
