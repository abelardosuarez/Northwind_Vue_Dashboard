# Application Modules

## Overview

The Northwind Sales Analytics Dashboard is organized into modular frontend and backend components.

The application follows a separation-of-concerns approach:

- Vue.js frontend for the user interface and data visualization.
- Node.js and Express backend for the REST API.
- SQL Server as the data source.
- Chart.js for interactive analytics visualizations.

This modular structure makes the application easier to understand, maintain, test, and extend.

---

# 1. Frontend Modules

The frontend is implemented using Vue.js Single File Components.

Location:

```text
src/
1.1 App.vue

Location:

src/App.vue
Responsibility

App.vue is the main dashboard controller and coordinates the frontend application.

It is responsible for:

Managing the selected year.
Calling the REST API.
Loading dashboard data.
Loading top customers.
Loading monthly sales.
Loading top products.
Loading top categories.
Calculating Average Order Value.
Passing data to reusable Vue components.
Year Filtering

The dashboard supports:

All Years
1996
1997
1998

The selected year is sent to the REST API as a query parameter.

Example:

/api/dashboard?year=1997

When All Years is selected, the API is called without a year parameter.

Data Flow
User selects Year
       |
       v
     App.vue
       |
       v
   REST API
       |
       v
   SQL Server
       |
       v
   JSON response
       |
       v
     App.vue
       |
       v
Vue dashboard components
2. KPI Module
2.1 KpiCard.vue

Location:

src/components/KpiCard.vue
Responsibility

KpiCard.vue is a reusable presentation component used to display a single Key Performance Indicator (KPI).

The component receives:

title
value

as properties.

Dashboard KPIs

The dashboard currently displays:

Total Sales
Total Orders
Customers
Products
Average Order Value
Design Principle

The component is intentionally generic so that additional KPIs can be added without creating a new component for each metric.

3. Customer Analytics Module
3.1 TopCustomers.vue

Location:

src/components/TopCustomers.vue
Responsibility

Displays the top customers ranked by total sales.

The component receives customer data from App.vue.

Data Displayed

Each customer entry contains:

Customer name
Total sales

Sales values are formatted as US currency.

Data Source

The component receives data from:

GET /api/top-customers

or:

GET /api/top-customers?year=YYYY
4. Sales Trend Module
4.1 MonthlySalesTrend.vue

Location:

src/components/MonthlySalesTrend.vue
Responsibility

Displays the monthly sales trend using a Chart.js line chart.

Visualization

The chart represents:

Sales period
Total sales

For a specific year, the chart displays the monthly sales for that year.

When All Years is selected, the chart displays the available monthly sales periods across the Northwind dataset.

Technology

The component uses:

vue-chartjs
chart.js
Data Source

The component receives data from:

GET /api/monthly-sales

or:

GET /api/monthly-sales?year=YYYY
Formatting

The Y-axis and tooltips display sales values using US currency formatting.

5. Product Analytics Module
5.1 TopProducts.vue

Location:

src/components/TopProducts.vue
Responsibility

Displays the top 10 products ranked by sales.

Visualization

The component uses a horizontal bar chart.

The chart displays:

Product name
Total sales

Sales values are displayed directly on the bars.

Technology

The component uses:

vue-chartjs
chart.js
chartjs-plugin-datalabels
Data Source

The component receives data from:

GET /api/top-products

or:

GET /api/top-products?year=YYYY
Business Purpose

This visualization helps identify the products generating the highest revenue and provides a quick view of product sales performance.

6. Category Analytics Module
6.1 TopCategories.vue

Location:

src/components/TopCategories.vue
Responsibility

Displays product categories ranked by total sales.

Visualization

The component uses a horizontal bar chart.

The chart displays:

Category name
Total sales

Sales values are displayed directly on the bars.

Technology

The component uses:

vue-chartjs
chart.js
chartjs-plugin-datalabels
Data Source

The component receives data from:

GET /api/top-categories

or:

GET /api/top-categories?year=YYYY
Business Purpose

The visualization provides a high-level view of revenue contribution by product category.

7. Backend Modules

The backend is implemented using Node.js and Express.

Location:

api/

The backend provides the REST API used by the Vue.js frontend.

7.1 server.js

Location:

api/server.js
Responsibility

server.js is the main backend application module.

It:

Creates the Express application.
Enables CORS.
Enables JSON request processing.
Defines REST API endpoints.
Validates the optional year parameter.
Executes SQL queries.
Returns JSON responses.
Handles database errors.
Starts the API server.
Server Port

The API runs on:

http://localhost:3000
Year Validation

The API accepts the following years:

1996
1997
1998

Invalid years return an HTTP 400 response.

8. Database Access Module
8.1 db.js

Location:

api/db.js
Responsibility

db.js provides the database access layer between the Express API and SQL Server.

It:

Loads environment variables.
Builds the SQL Server ODBC connection string.
Opens a database connection.
Executes SQL queries.
Closes the database connection.
Returns query results to the calling module.
Database Technology

The application uses:

SQL Server
ODBC Driver 18 for SQL Server
msnodesqlv8
Configuration

Database configuration is stored in:

api/.env

Sensitive configuration values are not committed to GitHub.

9. Database Connectivity Test Module
9.1 test-db.js

Location:

api/test-db.js
Responsibility

test-db.js is a standalone database connectivity validation script.

It verifies that:

Node.js can load the database module.
The ODBC connection can be established.
SQL Server is accessible.
The Northwind database can execute queries.
Validation Query

The test executes a query against the Customers table and returns the database name and customer count.

This provides a simple diagnostic mechanism before starting the complete REST API.

10. REST API Modules

The backend exposes separate endpoints for each dashboard data requirement.

10.1 Health Check
GET /api/health
Purpose

Confirms that the REST API is running.

10.2 Dashboard Summary
GET /api/dashboard

or:

GET /api/dashboard?year=1997
Returns
Total Orders
Customers
Products
Total Sales

This endpoint provides the data required by the KPI cards.

10.3 Top Customers
GET /api/top-customers

or:

GET /api/top-customers?year=1997
Returns

The top 10 customers ranked by total sales.

10.4 Monthly Sales
GET /api/monthly-sales

or:

GET /api/monthly-sales?year=1997
Returns

Monthly sales totals used by the sales trend chart.

10.5 Top Products
GET /api/top-products

or:

GET /api/top-products?year=1997
Returns

The top 10 products ranked by total sales.

10.6 Top Categories
GET /api/top-categories

or:

GET /api/top-categories?year=1997
Returns

Product categories ranked by total sales.

11. Configuration Modules
11.1 package.json

Location:

package.json

Defines the frontend project:

Dependencies
Development dependencies
Build commands
Development server
Linting commands
11.2 vite.config.js

Location:

vite.config.js

Configures the Vite development and production build environment for the Vue.js application.

It also configures the Vue plugin and source alias.

11.3 eslint.config.js

Location:

eslint.config.js

Defines the project's ESLint configuration.

It provides JavaScript and Vue.js code-quality validation.

The API directory is excluded from frontend linting because it has its own Node.js runtime configuration.

11.4 api/package.json

Location:

api/package.json

Defines the backend dependencies and Node.js configuration.

Main backend dependencies include:

Express
CORS
dotenv
msnodesqlv8
11.5 api/.env

Location:

api/.env

Stores local database configuration.

Example configuration:

DB_SERVER=localhost
DB_DATABASE=Northwind
DB_TRUST_SERVER_CERTIFICATE=true

The .env file is excluded from source control.

12. Security and Separation of Responsibilities

The application separates the frontend from direct database access.

The Vue.js application does not connect directly to SQL Server.

Instead:

Vue.js
   |
   | HTTP / REST
   v
Node.js + Express
   |
   | SQL
   v
SQL Server

This architecture provides a clear separation between:

Presentation
API/business logic
Database access

Database configuration is kept outside the frontend application and sensitive environment configuration is excluded from Git.

13. Module Interaction Summary

The main application interaction can be summarized as:

                    Vue.js Frontend
                         |
        +----------------+----------------+
        |                |                |
    App.vue          Components       Chart.js
        |                |
        +----------------+
                 |
              REST API
                 |
           Express server
                 |
              db.js
                 |
           SQL Server
                 |
             Northwind

The modular architecture allows each part of the application to have a clearly defined responsibility while keeping the overall solution simple and maintainable.

14. Extensibility

The current architecture can be extended with additional analytics modules without changing the overall application structure.

Potential future modules could include:

Customer retention analysis
RFM customer segmentation
ABC product classification
Pareto analysis
Sales by country
Sales by employee
Order fulfillment analysis

Additional REST endpoints and Vue components can be introduced following the same modular pattern used by the existing dashboard.

15. Module Design Principles

The application follows these main design principles:

Separation of Concerns

Each module has a specific responsibility.

Reusability

Reusable Vue components are used for KPI and analytical visualizations.

API-Based Data Access

The frontend communicates with SQL Server through REST API endpoints rather than direct database connections.

Maintainability

Frontend, backend, database access, and configuration are separated into logical modules.

Extensibility

New analytical features can be added through additional API endpoints and Vue components without redesigning the entire application.
