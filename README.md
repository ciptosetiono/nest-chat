<h1>Nest Chat App</h1>

A Simple Chat Application using NestJS for the backend, Next.js for the frontend, and MongoDB as the database.

<h2>Features</h2>

1. JWT Authentication (Signup, Signin, Update Profile)

2. CRUD Chat Room

3. Real-time Chat using Socket.IO

4. Sending & Receive Text Message

5. Sending & Receive File Message

<h2>Technologies Used</h2>

1. Backend: NestJS, Mongoose, Socket.IO

2. Frontend: Next.js (App Router), Tailwind CSS

3. Database: MongoDB

<h2>Installation</h2>

**1. Clone Repository**

git clone https://github.com/ciptosetiono/nest-chat.git
cd nest-chat

**2. Setup Backend (NestJS)**

cd backend
npm install
cp .env.example .env

Edit the .env file according to the required configurations, such as the MongoDB database and JWT secret key.

Run the backend server:

npm run start:dev

By default, the backend will run at http://localhost:3001

**3. Setup Frontend (Next.js)**

cd frontend
npm install
cp .env.example .env

Edit the .env file to set up the backend URL.

Run the frontend server:

npm run dev

By default, the frontend will run at http://localhost:3000

<h2>Usage</h2>

1. Open the application at http://localhost:3000

2. Create a new account or log in with an existing account

3. Update your profile if needed

4. Create or join a chat room

5. Start real-time chat
