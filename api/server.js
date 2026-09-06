require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { query } = require('./db')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Health check

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Northwind API is running'
  })
})

app.get('/api/dashboard', async (req, res) => {
  try {
    const { year } = req.query

    let whereClause = ''

    if (year) {
      const selectedYear = Number(year)

      if (!Number.isInteger(selectedYear) || selectedYear < 1996 || selectedYear > 1998) {
        return res.status(400).json({
          error: 'Year must be 1996, 1997, or 1998'
        })
      }

      whereClause = `WHERE YEAR(o.OrderDate) = ${selectedYear}`
    }

    const result = await query(`
      SELECT
        COUNT(DISTINCT o.OrderID) AS TotalOrders,
        COUNT(DISTINCT o.CustomerID) AS Customers,
        COUNT(DISTINCT od.ProductID) AS Products,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS TotalSales
      FROM Orders o
      INNER JOIN [Order Details] od
        ON o.OrderID = od.OrderID
      ${whereClause}
    `)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Database query failed'
    })
  }
})

// Top customers
app.get('/api/top-customers', async (req, res) => {
  try {
    const { year } = req.query

    let whereClause = ''

    if (year) {
      const selectedYear = Number(year)

      if (!Number.isInteger(selectedYear) || selectedYear < 1996 || selectedYear > 1998) {
        return res.status(400).json({
          error: 'Year must be 1996, 1997, or 1998'
        })
      }

      whereClause = `WHERE YEAR(o.OrderDate) = ${selectedYear}`
    }

    const result = await query(`
      SELECT TOP 10
        c.CompanyName AS CustomerName,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS TotalSales
      FROM Orders o
      INNER JOIN Customers c
        ON o.CustomerID = c.CustomerID
      INNER JOIN [Order Details] od
        ON o.OrderID = od.OrderID
      ${whereClause}
      GROUP BY c.CustomerID, c.CompanyName
      ORDER BY TotalSales DESC
    `)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Top customers query failed'
    })
  }
})

// Monthly sales trend
app.get('/api/monthly-sales', async (req, res) => {
  try {
    const { year } = req.query

    let whereClause = ''

    if (year) {
      const selectedYear = Number(year)

      if (!Number.isInteger(selectedYear) || selectedYear < 1996 || selectedYear > 1998) {
        return res.status(400).json({
          error: 'Year must be 1996, 1997, or 1998'
        })
      }

      whereClause = `WHERE YEAR(o.OrderDate) = ${selectedYear}`
    }

    const result = await query(`
      SELECT
        YEAR(o.OrderDate) AS SalesYear,
        MONTH(o.OrderDate) AS SalesMonth,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS TotalSales
      FROM Orders o
      INNER JOIN [Order Details] od
        ON o.OrderID = od.OrderID
      ${whereClause}
      GROUP BY
        YEAR(o.OrderDate),
        MONTH(o.OrderDate)
      ORDER BY
        SalesYear,
        SalesMonth
    `)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Monthly sales query failed'
    })
  }
})

// Top products by sales
app.get('/api/top-products', async (req, res) => {
  try {
    const { year } = req.query

    let whereClause = ''

    if (year) {
      const selectedYear = Number(year)

      if (!Number.isInteger(selectedYear) || selectedYear < 1996 || selectedYear > 1998) {
        return res.status(400).json({
          error: 'Year must be 1996, 1997, or 1998'
        })
      }

      whereClause = `WHERE YEAR(o.OrderDate) = ${selectedYear}`
    }

    const result = await query(`
      SELECT TOP 10
        p.ProductName,
        SUM(od.Quantity) AS TotalUnits,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS TotalSales
      FROM Orders o
      INNER JOIN [Order Details] od
        ON o.OrderID = od.OrderID
      INNER JOIN Products p
        ON od.ProductID = p.ProductID
      ${whereClause}
      GROUP BY
        p.ProductID,
        p.ProductName
      ORDER BY
        TotalSales DESC
    `)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Top products query failed'
    })
  }
})

// Top categories by sales
app.get('/api/top-categories', async (req, res) => {
  try {
    const { year } = req.query

    let whereClause = ''

    if (year) {
      const selectedYear = Number(year)

      if (!Number.isInteger(selectedYear) || selectedYear < 1996 || selectedYear > 1998) {
        return res.status(400).json({
          error: 'Year must be 1996, 1997, or 1998'
        })
      }

      whereClause = `WHERE YEAR(o.OrderDate) = ${selectedYear}`
    }

    const result = await query(`
      SELECT
        c.CategoryName,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS TotalSales
      FROM Orders o
      INNER JOIN [Order Details] od
        ON o.OrderID = od.OrderID
      INNER JOIN Products p
        ON od.ProductID = p.ProductID
      INNER JOIN Categories c
        ON p.CategoryID = c.CategoryID
      ${whereClause}
      GROUP BY
        c.CategoryID,
        c.CategoryName
      ORDER BY
        TotalSales DESC
    `)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Top categories query failed'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Northwind API running on http://localhost:${PORT}`)
})
