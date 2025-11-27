 HRMS (Human Resource Management System)
A full-stack Human Resource Management platform built to streamline employee administration, team assignments, and system auditing. The application follows a multi-tenant architecture, allowing different organizations to register and manage their own data securely.


web site link Frontend: ( https://hrms-frontend-h776.onrender.com )

web site link Backend ( https://hrms-backend-0cye.onrender.com )

<img width="1536" height="1024" alt="HRM project" src="https://github.com/user-attachments/assets/4da86b87-80b9-4986-ac04-2c7f14f306bd" />

home page: 
<img width="1910" height="978" alt="image" src="https://github.com/user-attachments/assets/e191b7d8-6271-423a-83e9-048954f8cd11" />

Employee dash board:

<img width="1917" height="940" alt="image" src="https://github.com/user-attachments/assets/6c038945-f361-420f-8222-60423b176ccb" />

Reports

<img width="1892" height="871" alt="image" src="https://github.com/user-attachments/assets/92888f42-cb58-431e-b5a1-487e43b0d44b" />

Teams:

<img width="1895" height="913" alt="image" src="https://github.com/user-attachments/assets/3e899e3a-3f2a-4d71-97a7-a7f3e0592c47" />

 Getting Started

You can run this project either using Docker (Recommended) or Manually.
Method 1: Using Docker  (Recommended)
Prerequisites: Docker Desktop installed.
Clone the repository:
code
Bash
git clone https://github.com/your-username/hrms-project.git
cd hrms-project
Build and Run the application:
code
Bash
docker-compose up --build
Access the app:
Frontend: http://localhost:5173
Backend: http://localhost:5000
Database: Port 5432 (User: lakshmi, Pass: lakshmi, DB: hrms_db)
Method 2: Manual Setup 🛠️
Prerequisites: Node.js and PostgreSQL installed locally.
1. Database Setup
Create a local PostgreSQL database named hrms_db.
2. Backend Setup
code
Bash
cd Backend
npm install
# Create a .env file based on the template below
npm start
3. Frontend Setup
code
Bash
cd Frontend
npm install
# Create a .env file based on the template below
npm run dev
 Environment Variables (.env)
Backend (Backend/.env)
code
Env
PORT=5000
DB_HOST=localhost       # Use 'db' if using Docker, 'localhost' if manual
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_secret_key
NODE_ENV=development
Frontend (Frontend/.env)
code
Env
# Note: If using Docker, set this to http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000/api
 API Endpoints
Method	Endpoint	Description
Auth		
POST	/api/auth/register	Register new Organization & Admin
POST	/api/auth/login	Login and receive Bearer Token
Employees		
GET	/api/employees	List all employees
POST	/api/employees	Create new employee
DELETE	/api/employees/:id	Remove employee
Teams		
GET	/api/teams	List departments/teams
POST	/api/teams/:id/assign	Assign employee to team
Logs		
GET	/api/logs	Get audit trail for Reports page
 Deployment (Render)
This project is configured for deployment on Render.
Database: Create a Managed PostgreSQL instance.
Backend: Deploy as a Web Service (using the Docker runtime).
Env Vars: DB_HOST (from Render), DB_PASS, NODE_ENV=production.
Frontend: Deploy as a Static Site.
Build Command: npm install; npm run build
Publish Dir: dist
Env Var: VITE_API_BASE_URL = Your Render Backend URL.
