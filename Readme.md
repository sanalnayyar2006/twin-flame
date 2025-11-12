1. Project Title
TwinFlame – An Interactive Daily Task & Fun App for Couples
2. Problem Statement
In modern relationships, couples often struggle to stay emotionally connected due to busy schedules or long distances. Existing messaging apps allow chatting but lack engaging activities that help maintain closeness and fun.
TwinFlame aims to solve this by providing a platform where couples can perform daily fun tasks, share personal photos, videos, and voice notes, and play truth & dare games together, strengthening their bond through small daily interactions.
3. System Architecture
Overall Flow: 
 Frontend → Backend (API) → Database → Cloud Storage
Example Stack:
Frontend: React.js with React Router for navigation
Backend: Node.js + Express.js 
Database: MongoDB (non-relational)
Authentication: JWT-based secure login/signup (Firebase optional)
Media Storage: Firebase Storage (for images, videos, and voice notes)
Hosting:
Frontend: Vercel / Netlify


Backend:


Database: MongoDB Atlas
Key Features
Category
Features
Authentication & Authorization
User registration, login, logout, partner linking via unique code(optional)
Daily Tasks
Each day, couples receive a random interactive task (e.g., “Send a selfie while eating ”, “Record a voice note saying ‘I like it’ 3 times”)
Media Sharing
Upload and share images, short videos, and voice notes privately between partners
Truth & Dare
Random truth/dare game for couples to play within the app
Chat Feature
Private one-to-one chat between partners
Frontend Routing
Pages: Home, Login, Dashboard, Daily Task, Truth & Dare, Chat (pages may vary)


Pagination 
Used for chat messages, uploads, and task history to load data efficiently
Searching
Enables keyword-based search in chats, truth/dare, and media
Sorting&Filtering
Allows sorting and filtering chats, uploads, and tasks by type, date, or status
Hosting
Both backend and frontend deployed on public URLs for easy demo access or keeping them as a app


4. Tech Stack
Layer
Technologies
Frontend
React.js, React Router, TailwindCSS
Backend
Node.js, Express.js
Database
MongoDB (Mongoose)
Authentication
JWT / Firebase Authentication
Media Storage
Cloudinary / Firebase Storage


5. API Overview
Endpoint
Method
Description
Access
/api/auth/signup
POST
Register a new user
Public
/api/auth/login
POST
Authenticate user and return JWT token
Public
/api/tasks/today
GET
Fetch today’s daily task
Authenticated
/api/upload
POST
Upload image/video/voice note
Authenticated
/api/truthdare/random
GET
Get random truth or dare question
Authenticated
/api/chat
GET/POST
Send or fetch chat messages
Authenticated
/api/chat/messageid
DELETE
Delete a specific chat msg/media
Authenticated     
/api/user/profile
 PUT 
Update user profile info
Mark today’s task as completed or update task status
Edit/update a sent message (within time limit)



Authenticated




  	    	        
     
					    
