# Jira
📌 What it is:
A personal productivity tracker for developers that includes:

Daily task board (like Trello)

Coding streak tracker (sync or mock LeetCode/GitHub stats)

Notes section (Markdown editor)

Pomodoro timer with break tracking

💻 Tech Stack Suggestions:
Layer	Tech
Frontend	React + TailwindCSS / Material UI
Backend	Node.js + Express (or Python Flask)
Database	MongoDB (for tasks, notes, stats)
Auth	JWT-based login (user signup/login)
Deployment	Vercel (frontend) + Render/Heroku (backend)

🔍 Features Breakdown:
🔹 User Authentication
Register/Login

JWT token-based session

User data stored securely

🔹 Task Board
Kanban-style (To Do, In Progress, Done)

Drag-and-drop cards (optional)

🔹 Coding Stats
Display mock GitHub or LeetCode streak data (or fetch if API allows)

Daily coding goal and completion status

🔹 Notes
Markdown editor (React Markdown)

Save notes per user

CRUD functionality

🔹 Pomodoro Timer
Timer with work & break intervals

Optional sound notifications

Track total focused minutes

🚀 Stretch Goals (for phase 2)
Leaderboard if it's multi-user

Chrome extension version

GitHub calendar heatmap integration

Email notifications
