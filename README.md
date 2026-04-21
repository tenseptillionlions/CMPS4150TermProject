# CMPS4150 Project 2 - Helpers System (Skeleton)

This project is a minimal but complete "helpers" system using **Node + MongoDB**.
It is intentionally simple so students can understand and extend it.

## Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create/update `.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   DB_NAME=cmps4150_helpers
   PORT=3000
   SESSION_SECRET=change-me
   SEED_OWNER_USERNAME=owner1
   SEED_OWNER_PASSWORD=password123
   ```
   Note: the code also accepts `mongo_uri` for compatibility.
3. Start:
   ```bash
   npm start
   ```
4. Open:
   `http://localhost:3000`

## Required Tasks (T1-T8) Mapping

- **T1**: Task board at `/` lists active tasks from MongoDB.
- **T2.1**: Authenticated owners can create tasks at `/owner/tasks`.
- **T2.2**: Owners can view volunteers and dismiss them from their own tasks.
- **T3**: Task board has a subscribe button for each available task.
- **T4**: Any volunteer can subscribe to any number of tasks using a unique identifier.
- **T5 (MVC)**:
  - Models: `src/models/*.js`
  - Controllers: `src/controllers/*.js`
  - Views: `src/views/*.js`
- **T6 (Observer)**:
  - Subject: `src/observers/taskEventSubject.js`
  - Observer: `src/observers/statsObserver.js`
  - Events fire when tasks or volunteers change.
- **T7 (Singleton DB)**:
  - `src/config/dbSingleton.js`
- **T8 (Statistics)**:
  - `/stats` shows current volunteer counts for active tasks.
  - Counts are kept in `taskStatistics` via observer updates.

## Main Routes

- `GET /` - Entry view (task list + volunteer subscribe)
- `GET /login`, `POST /login`, `POST /logout` - Owner authentication
- `GET /register`, `POST /register` - Owner account creation
- `GET /owner/tasks`, `POST /owner/tasks` - Owner dashboard and task creation
- `POST /owner/tasks/:taskId/dismiss` - Owner dismisses a volunteer
- `POST /owner/tasks/:taskId/active` - Owner toggles task active/inactive
- `GET /subscriptions?identifier=...` - Volunteer lookup by unique identifier
- `GET /stats` - Active task statistics

## Report Checklist Template

The requested checklist template is included as:

- `Project-2-report-template-simple.md`

