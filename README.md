# Classroom Booking System

This project is a complete online classroom booking system, built with a modern tech stack.

## Tech Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS, Vite
- **Backend:** NestJS, TypeScript, Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT

## Project Structure

```
/
├── /frontend          # React Application
├── /backend           # NestJS API Server
├── /shared            # Shared Types
└── PROGRESS.md        # Original project plan
```

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL database running locally or on a server.

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add your database connection string:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
    Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials.

4.  **Run database migrations:**
    This will create the tables in your database based on the `schema.prisma` file.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the backend server:**
    ```bash
    npm run start:dev
    ```
    The backend will be running at `http://localhost:3000`.

### 3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173` (or another port if 5173 is busy).

## Project is Ready!

Once both the backend and frontend are running, you can open your browser to the frontend URL and start using the application.

- **Default User Roles:** New users registered through the app will have the `USER` role. To create an `ADMIN` user, you can manually change the role in the database.
- **API Endpoints:** The backend API endpoints are documented in the `PROGRESS.md` file.
"# room-booking" 
