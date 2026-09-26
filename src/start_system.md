
# How to Start the Northwind Vue Dashboard

## 1. Start the Backend API

Open a terminal and run:

```powershell
cd C:\Projects\Northwind_Vue_Dashboard\api
node server.js

The API will run on:

http://localhost:3000
Test the API

Health check:

http://localhost:3000/api/health

Dashboard data:

http://localhost:3000/api/dashboard

Top customers for 1997:

http://localhost:3000/api/top-customers?year=1997

---

## 2. Start the Frontend

Open a second terminal and run:

cd C:\Projects\Northwind_Vue_Dashboard
npm run dev

Vite will display the local URL for the Vue application in the terminal.

Open that URL in your browser.

---

## 3. SQL Server Reporting Services

The project also uses SQL Server Reporting Services.

Report Server:

http://localhost:3000/ReportServer/

The Report Server URL may vary depending on the local SQL Server Reporting Services configuration.