# REST API Documentation

## 1. Overview

The Northwind Sales Analytics Dashboard uses a REST API implemented with Node.js and Express.

The API provides the data required by the Vue.js frontend and acts as the intermediary between the dashboard and the SQL Server Northwind database.

The API runs locally on:

```text
http://localhost:3000

The architecture is:

Vue.js
   |
   | HTTP / JSON
   v
Node.js + Express REST API
   |
   | SQL
   v
SQL Server / Northwind
2. API Responsibilities

The REST API is responsible for:

Receiving HTTP requests from the Vue.js frontend.
Reading query parameters.
Validating the selected year.
Executing SQL queries against Northwind.
Returning analytical results as JSON.
Handling database errors.
Keeping database connectivity separate from the frontend.

The main implementation file is:

api/server.js

Database connectivity is handled by:

api/db.js
3. Base URL

For local development, the API base URL is:

http://localhost:3000

All dashboard endpoints use the /api prefix.

Example:

http://localhost:3000/api/dashboard
4. Supported Years

The dashboard supports the following years:

1996
1997
1998

It also supports an unfiltered:

All Years

When a specific year is selected, the year is provided as a query parameter.

Example:

/api/dashboard?year=1997

When All Years is selected, the endpoint is called without the year parameter.

Example:

/api/dashboard
5. Year Parameter Validation

The API validates the optional year query parameter.

Valid values are:

1996
1997
1998

If the parameter is not an integer within the supported range, the API returns HTTP 400.

Example:

GET /api/dashboard?year=2000

Response:

{
  "error": "Year must be 1996, 1997, or 1998"
}

This validation is implemented in the dashboard analytics endpoints.

6. Endpoint Summary

The API provides the following endpoints:

Method	Endpoint	Purpose
GET	/api/health	API health check
GET	/api/dashboard	Dashboard KPI summary
GET	/api/top-customers	Top 10 customers by sales
GET	/api/monthly-sales	Monthly sales trend
GET	/api/top-products	Top 10 products by sales
GET	/api/top-categories	Sales by product category

All endpoints return JSON responses.

7. Health Check
Endpoint
GET /api/health
Purpose

Confirms that the Northwind REST API is running.

Example Request
http://localhost:3000/api/health
Example Response
{
  "status": "OK",
  "message": "Northwind API is running"
}

This endpoint does not access the database.

8. Dashboard Summary
Endpoint
GET /api/dashboard
Filtered Request
GET /api/dashboard?year=1997
Purpose

Returns the main KPI values used by the dashboard.

The endpoint provides:

Total Orders
Customers
Products
Total Sales
SQL Metrics

The endpoint calculates:

TotalOrders
Customers
Products
TotalSales

Sales are calculated using:

Quantity × UnitPrice × (1 - Discount)
Example Request
http://localhost:3000/api/dashboard?year=1997
Example Response
[
  {
    "TotalOrders": 408,
    "Customers": 86,
    "Products": 77,
    "TotalSales": 617085.2005
  }
]

The exact numeric precision returned by SQL Server may vary.

9. Top Customers
Endpoint
GET /api/top-customers
Filtered Request
GET /api/top-customers?year=1997
Purpose

Returns the top 10 customers ranked by total sales.

Data Returned

Each record contains:

CustomerName
TotalSales
Example Request
http://localhost:3000/api/top-customers?year=1997
Example Response
[
  {
    "CustomerName": "Customer Example",
    "TotalSales": 10000.00
  }
]

The endpoint returns up to 10 customers ordered from highest to lowest sales.

10. Monthly Sales
Endpoint
GET /api/monthly-sales
Filtered Request
GET /api/monthly-sales?year=1997
Purpose

Provides monthly sales totals used by the Monthly Sales Trend visualization.

Data Returned

Each record contains:

SalesYear
SalesMonth
TotalSales
Example Request
http://localhost:3000/api/monthly-sales?year=1997
Example Response
[
  {
    "SalesYear": 1997,
    "SalesMonth": 1,
    "TotalSales": 47385.00
  },
  {
    "SalesYear": 1997,
    "SalesMonth": 2,
    "TotalSales": 48000.00
  }
]

When a specific year is selected, the results are grouped by month for that year.

When All Years is selected, the endpoint returns the available monthly periods across the Northwind dataset.

11. Top Products
Endpoint
GET /api/top-products
Filtered Request
GET /api/top-products?year=1997
Purpose

Returns the top 10 products ranked by total sales.

Data Returned

Each record contains:

ProductName
TotalUnits
TotalSales
Example Request
http://localhost:3000/api/top-products?year=1997
Example Response
[
  {
    "ProductName": "Côte de Blaye",
    "TotalUnits": 623,
    "TotalSales": 41918.85
  }
]

The products are ordered from highest to lowest total sales.

12. Top Categories
Endpoint
GET /api/top-categories
Filtered Request
GET /api/top-categories?year=1997
Purpose

Returns sales totals grouped by product category.

Data Returned

Each record contains:

CategoryName
TotalSales
Example Request
http://localhost:3000/api/top-categories?year=1997
Example Response
[
  {
    "CategoryName": "Beverages",
    "TotalSales": 100000.00
  }
]

Categories are ordered from highest to lowest total sales.

13. API-to-Component Mapping

Each REST endpoint supplies data to a specific dashboard module.

API Endpoint	Vue Component / Usage
/api/health	API validation
/api/dashboard	KPI cards
/api/top-customers	TopCustomers.vue
/api/monthly-sales	MonthlySalesTrend.vue
/api/top-products	TopProducts.vue
/api/top-categories	TopCategories.vue

The main coordination takes place in:

src/App.vue
14. Frontend API Request Pattern

App.vue builds the API URL according to the selected year.

For All Years:

/api/dashboard

For a specific year:

/api/dashboard?year=1997

The same pattern is used for all analytical endpoints.

All Years
    |
    +--> /api/dashboard
    +--> /api/top-customers
    +--> /api/monthly-sales
    +--> /api/top-products
    +--> /api/top-categories

For a selected year:

1997
    |
    +--> /api/dashboard?year=1997
    +--> /api/top-customers?year=1997
    +--> /api/monthly-sales?year=1997
    +--> /api/top-products?year=1997
    +--> /api/top-categories?year=1997
15. Database Access

The REST API does not contain the database connection implementation directly.

Instead, server.js imports the query function from:

api/db.js

The flow is:

server.js
    |
    | query(sql)
    v
db.js
    |
    | ODBC
    v
SQL Server

This separation allows the API routes to focus on business queries while db.js handles database connectivity.

16. Database Technology

The backend uses:

SQL Server
ODBC Driver 18 for SQL Server
msnodesqlv8

Database configuration is stored in:

api/.env

Example local configuration:

DB_SERVER=localhost
DB_DATABASE=Northwind
DB_TRUST_SERVER_CERTIFICATE=true

The environment file is excluded from Git source control.

17. Error Handling

The API handles database errors using HTTP 500 responses.

Example:

{
  "error": "Database query failed"
}

Individual analytical endpoints provide endpoint-specific error messages.

Examples include:

Dashboard query failed
Top customers query failed
Monthly sales query failed
Top products query failed
Top categories query failed

Invalid year parameters return HTTP 400.

18. HTTP Status Codes

The API currently uses the following status codes:

Status	Meaning
200	Successful request
400	Invalid year parameter
500	Database or server error
19. API Testing

The API can be tested independently from the Vue.js frontend.

The health endpoint can be tested with:

GET /api/health

Database connectivity can be tested independently using:

api/test-db.js

This separation makes it possible to validate:

Database connectivity.
REST API availability.
API query execution.
Frontend integration.
20. Example API Testing Sequence

A typical validation sequence is:

1. Test SQL Server connectivity
          |
          v
   api/test-db.js
          |
          v
2. Start Express API
          |
          v
   http://localhost:3000
          |
          v
3. Test /api/health
          |
          v
4. Test analytical endpoints
          |
          v
5. Start Vue.js frontend
          |
          v
   http://localhost:5173

This approach helps isolate problems by application layer.

21. API Security Considerations

The API provides the database boundary between the browser and SQL Server.

The Vue.js frontend never receives the SQL Server connection string.

Database configuration remains on the backend.

The .env file is excluded from source control.

The browser communicates with the API using HTTP requests rather than direct database connections.

22. Extending the API

Additional analytical capabilities can be added by creating new Express routes.

The general pattern is:

New Business Requirement
        |
        v
SQL Query
        |
        v
Express Endpoint
        |
        v
JSON Response
        |
        v
Vue Component
        |
        v
Dashboard Visualization

Potential future endpoints could support:

/api/customer-retention
/api/rfm-segmentation
/api/abc-products
/api/pareto-analysis
/api/sales-by-country
/api/sales-by-employee

These are potential extensions and are not currently implemented.

23. API Design Principles

The REST API follows several design principles.

Separation of Responsibilities

Database connectivity is separated into db.js, while API routes are defined in server.js.

Business-Oriented Endpoints

Each endpoint represents a specific dashboard analytical requirement.

JSON-Based Communication

The frontend and backend communicate using HTTP and JSON.

Parameter Validation

The year parameter is validated before it is used to construct the SQL filter.

Reusability

The same endpoint supports both filtered and unfiltered data requests.

Extensibility

New analytical endpoints can be introduced without redesigning the existing API.

24. API Architecture Summary

The REST API acts as the integration layer between the Vue.js dashboard and SQL Server.

+---------------------------+
|        Vue.js             |
|     Dashboard UI          |
+-------------+-------------+
              |
              | HTTP / JSON
              v
+---------------------------+
|     Express REST API      |
|       server.js           |
+-------------+-------------+
              |
              | query(sql)
              v
+---------------------------+
|          db.js            |
|   Database Access Layer   |
+-------------+-------------+
              |
              | ODBC
              v
+---------------------------+
|       SQL Server          |
|        Northwind          |
+---------------------------+

The API provides a clean boundary between the presentation layer and the database, while allowing the dashboard to retrieve focused analytical datasets through independent REST endpoints.