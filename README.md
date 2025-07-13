# Initial Prototype Frontend

<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 03 11 PM" src="https://github.com/user-attachments/assets/ec541991-ad78-4f48-94fc-f8cd2b72b0d0" />
<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 03 45 PM" src="https://github.com/user-attachments/assets/3661e490-d2ae-484f-bbc1-3441093e068f" />
<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 03 20 PM" src="https://github.com/user-attachments/assets/a4958d01-14be-44be-84a9-34e843291d7d" />
<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 06 08 PM" src="https://github.com/user-attachments/assets/78a79ac9-8056-4998-84e5-e4e63693dfba" />
<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 04 12 PM" src="https://github.com/user-attachments/assets/400bd696-41ef-482e-bdc7-12f2db0b6bfc" />
<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 06 28 PM" src="https://github.com/user-attachments/assets/435d90a4-7535-4431-bc94-624450fdd999" />
<img width="1792" height="1137" alt="Screenshot 2025-07-13 at 3 06 22 PM" src="https://github.com/user-attachments/assets/7df7b5d9-b17c-413e-bc4f-f3c9dddf69ee" />


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
