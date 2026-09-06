# Application Architecture

## 1. Overview

The Northwind Sales Analytics Dashboard is a full-stack web application designed to provide interactive sales analytics using the Northwind database.

The solution follows a layered architecture that separates the presentation layer, API layer, database access layer, and data source.

The main technology stack is:

- SQL Server
- Node.js
- Express
- REST API
- Vue.js
- Chart.js

The architecture is designed to provide a clear separation of responsibilities, maintainability, and extensibility.

---

# 2. High-Level Architecture

The application follows this architecture:

```text
+-----------------------------+
|        SQL Server           |
|         Northwind           |
+-------------+---------------+
              |
              | SQL queries
              v
+-----------------------------+
|        db.js                |
|   Database Access Layer     |
+-------------+---------------+
              |
              v
+-----------------------------+
|      Node.js + Express      |
|          REST API           |
+-------------+---------------+
              |
              | HTTP / JSON
              v
+-----------------------------+
|         Vue.js              |
|      Frontend Application   |
+-------------+---------------+
              |
              v
+-----------------------------+
|         Chart.js            |
|      Data Visualizations    |
+-----------------------------+

Each layer has a specific responsibility and communicates with the adjacent layer.

3. Architectural Layers
3.1 Data Layer

The data layer is provided by Microsoft SQL Server and contains the Northwind database.

The database provides the transactional data used by the dashboard, including:

Customers
Orders
Order Details
Products
Categories

The application queries the database through the backend API rather than connecting to SQL Server directly from the browser.

3.2 Database Access Layer

The database access layer is implemented in:

api/db.js

This module provides the connection between the Node.js backend and SQL Server.

Its responsibilities include:

Loading database configuration.
Building the ODBC connection string.
Establishing a SQL Server connection.
Executing SQL queries.
Closing database connections.
Returning query results to the API layer.

The application uses:

ODBC Driver 18 for SQL Server
msnodesqlv8

This layer isolates database connectivity from the REST API implementation.

4. API Layer

The API layer is implemented using Node.js and Express.

Main file:

api/server.js

The API provides HTTP endpoints consumed by the Vue.js frontend.

The API is responsible for:

Receiving HTTP requests.
Validating request parameters.
Building SQL queries.
Executing database operations.
Returning JSON responses.
Handling database errors.

The API runs locally on:

http://localhost:3000
5. REST API Architecture

The REST API exposes separate endpoints for each analytical requirement.

/api/health
/api/dashboard
/api/top-customers
/api/monthly-sales
/api/top-products
/api/top-categories

The endpoints are intentionally separated by business function.

This allows individual dashboard modules to request only the data they need.

6. Year Filtering Architecture

The dashboard supports three specific years:

1996
1997
1998

It also supports:

All Years

When a specific year is selected, the frontend sends the year as a query parameter.

Example:

/api/dashboard?year=1997

The API validates the requested year before executing the query.

The SQL query then applies the corresponding year filter to the order date.

When All Years is selected, the frontend calls the endpoint without the year parameter.

Example:

/api/dashboard

This allows the same API endpoint to support both filtered and unfiltered dashboard views.

7. Frontend Layer

The frontend is implemented using Vue.js.

The main application file is:

src/App.vue

The frontend is responsible for:

Displaying the dashboard.
Managing the selected year.
Calling the REST API.
Receiving JSON responses.
Passing data to dashboard components.
Calculating the Average Order Value.
Rendering analytical visualizations.

The frontend does not connect directly to SQL Server.

8. Component Architecture

The Vue.js application uses reusable components.

src/
│
├── App.vue
│
└── components/
    ├── KpiCard.vue
    ├── TopCustomers.vue
    ├── MonthlySalesTrend.vue
    ├── TopProducts.vue
    └── TopCategories.vue

The main responsibility of each component is:

Component	Responsibility
App.vue	Dashboard controller and API coordination
KpiCard.vue	Reusable KPI presentation
TopCustomers.vue	Top customers by sales
MonthlySalesTrend.vue	Monthly sales trend
TopProducts.vue	Top 10 products by sales
TopCategories.vue	Sales by product category

This structure keeps presentation logic separated into focused components.

9. Data Visualization Layer

The dashboard uses Chart.js through vue-chartjs.

Chart-based components include:

MonthlySalesTrend.vue
TopProducts.vue
TopCategories.vue
Monthly Sales Trend

MonthlySalesTrend.vue uses a line chart to display sales over time.

The chart receives monthly sales data from:

/api/monthly-sales
Top Products

TopProducts.vue uses a horizontal bar chart to display the top 10 products by sales.

It also uses:

chartjs-plugin-datalabels

to display sales values directly on the chart.

Top Categories

TopCategories.vue uses a horizontal bar chart to display sales by product category.

It also uses:

chartjs-plugin-datalabels

for direct value labels.

10. End-to-End Data Flow

The complete data flow is:

User
 |
 | Selects year
 v
Vue.js / App.vue
 |
 | HTTP request
 v
Express REST API
 |
 | SQL query
 v
db.js
 |
 | ODBC
 v
SQL Server / Northwind
 |
 | Query result
 v
db.js
 |
 | JSON data
 v
Express REST API
 |
 | HTTP response
 v
Vue.js / App.vue
 |
 | Component props
 v
Dashboard Components
 |
 v
Charts / KPI Cards

This flow keeps database access on the server side and presentation logic on the client side.

11. Dashboard Request Flow

For example, when the user selects 1997:

User selects 1997
        |
        v
App.vue
        |
        v
GET /api/dashboard?year=1997
        |
        v
Express server
        |
        v
Year validation
        |
        v
SQL query
        |
        v
SQL Server
        |
        v
Dashboard result
        |
        v
JSON response
        |
        v
KPI cards updated

The same year selection is used when loading:

Top customers
Monthly sales
Top products
Top categories
12. Dashboard Layout Architecture

The dashboard is organized into three visual sections.

KPI Section

The first section contains five KPI cards:

Total Sales
Total Orders
Customers
Products
Average Order Value
Customer and Sales Trend Section

The second section contains:

+----------------------+---------------------------+
|    Top Customers     |    Monthly Sales Trend    |
|                      |                           |
+----------------------+---------------------------+
Product and Category Section

The third section contains:

+----------------------+---------------------------+
|     Top Products     |     Top Categories        |
|                      |                           |
+----------------------+---------------------------+

This layout provides a compact single-page analytical view.

13. Backend Request Processing

The backend follows this general processing sequence:

HTTP Request
     |
     v
Express Route
     |
     v
Read Query Parameters
     |
     v
Validate Year
     |
     v
Build SQL Query
     |
     v
Execute Query
     |
     v
Process Result
     |
     v
Return JSON

Errors during database operations are handled by the API and returned as HTTP error responses.

14. Database Connection Architecture

The database connection is intentionally isolated in db.js.

The API routes do not need to manage the ODBC connection directly.

Instead:

server.js
    |
    | query(sql)
    v
  db.js
    |
    | ODBC connection
    v
SQL Server

This provides a single database access point for the backend.

It also makes future changes to the database connectivity implementation easier to manage.

15. Configuration Architecture

The application uses separate configuration files for the frontend and backend.

Frontend Configuration
package.json
vite.config.js
eslint.config.js
jsconfig.json
Backend Configuration
api/package.json
api/.env

The database configuration is stored in the backend environment file rather than in frontend source code.

The .env file is excluded from Git source control.

16. Security Considerations

The architecture prevents the browser from connecting directly to SQL Server.

Instead:

Browser
   |
   | HTTP
   v
REST API
   |
   | SQL
   v
SQL Server

This provides an important separation between the public-facing frontend and the database.

Database connection information is also kept in environment configuration rather than being embedded in Vue.js components.

17. Error Handling

The REST API includes error handling for database operations.

If a database operation fails, the API returns an HTTP 500 response with an appropriate error message.

Invalid year parameters return an HTTP 400 response.

Example validation rule:

Valid:
1996
1997
1998

Invalid:
Other years
Non-numeric values

This prevents unsupported year values from being used by the application.

18. Development Architecture

During local development, the application uses two processes.

Frontend

Vue.js / Vite:

http://localhost:5173
Backend

Node.js / Express:

http://localhost:3000

The frontend communicates with the backend through HTTP requests.

localhost:5173
       |
       | REST / HTTP
       v
localhost:3000
       |
       | SQL / ODBC
       v
SQL Server
19. Production Build Architecture

The Vue.js frontend can be compiled into a production build using:

npm run build

The production build is generated in:

dist/

The backend remains responsible for providing the REST API and database access.

The architecture therefore maintains the same logical separation between:

Frontend
API
Database access
Database
20. Project Structure

The overall project structure is:

Northwind_Vue_Dashboard/
│
├── api/
│   ├── db.js
│   ├── server.js
│   ├── test-db.js
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── Application_Modules.md
│   └── Architecture.md
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── KpiCard.vue
│   │   ├── TopCustomers.vue
│   │   ├── MonthlySalesTrend.vue
│   │   ├── TopProducts.vue
│   │   └── TopCategories.vue
│   │
│   ├── App.vue
│   └── main.js
│
├── package.json
├── vite.config.js
├── eslint.config.js
├── jsconfig.json
├── README.md
└── .gitignore
21. Architectural Benefits

The architecture provides several benefits.

Separation of Concerns

Each layer has a clearly defined responsibility.

Maintainability

Changes to the frontend do not require changes to database connectivity.

Reusability

Vue components can be reused for additional analytical features.

Extensibility

Additional REST endpoints and dashboard components can be added without redesigning the entire application.

Security

The browser does not have direct access to SQL Server.

Testability

Database connectivity can be tested independently using:

api/test-db.js

The REST API can also be tested independently from the Vue.js frontend.

22. Future Architecture Extensions

The current architecture can support additional analytical capabilities.

Potential extensions include:

Customer Retention
RFM Segmentation
ABC Product Classification
Pareto Analysis
Sales by Country
Sales by Employee
Order Fulfillment Analysis

Each additional analytical feature can follow the same architecture:

SQL Query
    ↓
REST API Endpoint
    ↓
Vue Component
    ↓
Dashboard Visualization

This makes the architecture suitable for expanding the portfolio into a broader business intelligence application.

23. Architecture Summary

The Northwind Sales Analytics Dashboard uses a layered full-stack architecture:

+------------------------------------------------+
|                 Vue.js Frontend                |
|                                                |
| App.vue + Reusable Components + Chart.js       |
+------------------------+-----------------------+
                         |
                         | HTTP / JSON
                         v
+------------------------------------------------+
|              Node.js + Express                 |
|                  REST API                      |
+------------------------+-----------------------+
                         |
                         | SQL
                         v
+------------------------------------------------+
|                  db.js                         |
|            Database Access Layer               |
+------------------------+-----------------------+
                         |
                         | ODBC
                         v
+------------------------------------------------+
|               SQL Server                       |
|                Northwind                       |
+------------------------------------------------+

The architecture provides a clear separation between presentation, API processing, database connectivity, and data storage.

This design supports maintainability, testing, security, and future expansion of the analytics dashboard.