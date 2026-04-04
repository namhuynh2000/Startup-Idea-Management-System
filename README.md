# Full-Stack CRUD Application Project (Startup Idea Management System)

## Assessment 1.2 - Grading Information

To facilitate the marking process, please find the deployment details and access credentials below:

- **Public URL:** http://13.238.143.10/ *(Replace with your actual public IP if it has changed)*
- **User Access Credentials:**
  - **Email/Username:** user@user.com
  - **Password:** 1
- **Admin Access Credentials:**
  - **Email/Username:** admin@admin.com
  - **Password:** 1
  

## Overview

This is a full-stack web application developed to illustrate CRUD (Create, Read, Update, Delete) operations using a Node.js backend, React.js frontend, and MongoDB database. The application features:

- **User Authentication**: Registration, login, and session management.
- **User Dashboard**: Manage personal projects and tasks.
- **Admin Dashboard**: Manage users and system-wide projects.
- **Responsive Interface**: Built with React and Tailwind CSS.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Tailwind CSS
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **HTTP Client**: Axios

## System Requirements

- Node.js (version 22 or higher)
- MongoDB (installed locally or using MongoDB Atlas)
- npm or yarn

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/namhuynh2000/Startup-Idea-Management-System.git
cd Startup-Idea-Management-System
```

### 2. Install Dependencies

From the root directory of the project, run the following command to automatically install all dependencies for both the Backend and Frontend:

```bash
npm run install-all
```

### 3. Database Configuration

- Create a `.env` file in the `backend` directory (you can copy from the `.env.example` file if available).
- Update your MongoDB connection string and other environment variables in the `.env` file:
  ```env
  MONGO_URI=<Your_MongoDB_Connection_String>
  JWT_SECRET=<Your_JWT_Secret>
  PORT=5001
  ```

### 4. Run the Application

To start both the Backend and Frontend concurrently, run the following command from the root directory:

```bash
npm run start
```
*(Alternatively, you can use `npm start` or `npm run dev`)*.

- The **Frontend** application will automatically run on http://localhost:3000.
- The **Backend** API will run in the background on http://localhost:5001.

### 5. Access the Application

Open your web browser and navigate to http://localhost:3000 to use the application.

## Project Structure

```text
sampleapp_IFQ636/
├── backend/                 # Node.js Backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route logic and controllers
│   ├── middleware/          # Custom middleware (e.g., JWT auth)
│   ├── models/              # Mongoose data models
│   ├── routes/              # API routing definitions
│   ├── test/                # Automated tests
│   ├── server.js            # Server entry point
│   └── .env                 # Environment variables
├── frontend/                # React Frontend
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React Context for global state
│   │   ├── pages/           # Application pages
│   │   └── App.js           # Main root component
│   └── package.json
├── package.json             # Root-level scripts (install-all, start)
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile information

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

## Development

To develop and add new features:

1. **Backend**: Add routes, controllers, and models in their respective directories.
2. **Frontend**: Add components and pages in the `src` directory.
3. **Run tests**: Navigate to the `backend` folder and run the `npm test` command to execute automated tests.

## License

This project was developed for educational purposes.