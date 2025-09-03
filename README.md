# AI-Powered Collaborative Knowledge Hub (MERN + Gemini)

A full-stack MERN application where teams can create, manage, and search knowledge documents.  
Google Gemini AI provides automatic summarization, intelligent tags, semantic search, and Q&A across stored documents.

---

## Features

- **Authentication and Roles**
  - Register/Login with JWT.
  - Roles: user, admin.
  - Admins can edit or delete any document; users can only manage their own.

- **Document Management**
  - Create, edit, delete documents.
  - Automatic AI-generated summary and tags.
  - Versioning: each edit creates a new version with history view.

- **AI Features (Gemini)**
  - Summarize document content.
  - Generate intelligent tags.
  - Semantic embeddings for improved search.
  - Team Q&A: ask questions and get answers using stored documents.

- **Search and Filtering**
  - Regular keyword-based search.
  - Semantic search with embeddings.
  - Tag-based filtering.

- **Dashboard**
  - Document cards show title, summary, tags, and author.
  - Actions available: Summarize with Gemini, Generate Tags, Edit, Delete.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, Context API  
- **Backend:** Node.js, Express, MongoDB (Mongoose)  
- **Authentication:** JWT (JSON Web Tokens)  
- **AI:** Google Gemini API (Text + Embeddings)  

---

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

text

### 2. Install dependencies
Install server dependencies
cd server
npm install

Install client dependencies
cd ../client
npm install

text

### 3. Configure Environment Variables

#### Backend (`server/.env`)
Create a `.env` file inside **server/** with the following:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
GEMINI_API_KEY=<your-gemini-key>
PORT=5000
CLIENT_ORIGIN=*

text

#### Frontend (`client/.env`)
Create a `.env` file inside **client/** with the following:

VITE_API_URL=http://localhost:5000/api

text

### 4. Run the Application

Open two terminals:

**Terminal 1 - Run backend**
cd server
npm run dev

text

**Terminal 2 - Run frontend**
cd client
npm run dev

text

---

## 🚀 Demo Workflow

- Register or login.  
- Create a document — Gemini automatically generates summary and tags.  
- Search documents using text, semantic embeddings, or tags.  
- Ask a team question and receive answers from stored documents.  
- View version history of edited documents.  

---

This project is built with the **MERN stack** and **Google Gemini AI** to enable smarter team collaboration.

