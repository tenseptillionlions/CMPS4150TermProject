# Project Walkthrough

This file explains the project structure for the CMPS4150 Helpers System skeleton.  

### Root Files

- `README.md`: Main project documentation and T1-T8 mapping. It includes setup, run steps, and key routes.

- `Project-2-report-template-simple.md`: Report checklist template requested in the project description. It helps document completion evidence for each required task and pattern.

- `ProjWalkthrough.md`: This walkthrough document. It gives a quick structural map and purpose of each project file.

### `src/` Core App

- `src/app.js`: Application entry point that configures Express, sessions, routes, DB startup, and observer registration. It also triggers an initial statistics rebuild and starts the web server.

### `src/config/`

- `src/config/dbSingleton.js`: Implements the Singleton pattern for database access. It guarantees one shared Mongo client/database instance is reused across the app.

### `src/controllers/`

- `src/controllers/authController.js`: Handles owner login, logout, and registration workflows. It reads form input, calls the user model, and returns view responses or redirects.

- `src/controllers/homeController.js`: Serves the entry task board (`/`) with active tasks available for volunteering. It 
passes model data into the home view.

- `src/controllers/ownerController.js`: Handles owner-only features like creating tasks, dismissing volunteers, and toggling task active status. It emits task events so observers can keep stats synchronized.

- `src/controllers/responseHelpers.js`: Contains helper logic for redirecting with success/error query messages. This keeps common controller response behavior simple and consistent.

- `src/controllers/statsController.js`: Loads active-task statistics and renders the stats page. It is the main endpoint for T8 reporting.

- `src/controllers/volunteerController.js`: Handles volunteer subscription requests and volunteer lookup by unique identifier. It also emits observer events when subscription state changes.

### `src/middleware/`

- `src/middleware/requireAuth.js`: Route guard for owner-only actions. If no authenticated session user exists, it redirects to the login page.

### `src/models/`

- `src/models/statisticsModel.js`: Encapsulates reads/writes to the `taskStatistics` collection. It supports upsert, rebuild, remove, and active-stat query operations.

- `src/models/taskModel.js`: Encapsulates task and volunteer persistence logic in MongoDB. It includes create/list/update flows and volunteer subscribe/dismiss behaviors.

- `src/models/userModel.js`: Encapsulates owner account data operations. It seeds a default owner, validates credentials, and supports account creation.

### `src/observers/`

- `src/observers/statsObserver.js`: Concrete observer that reacts to task-related events. It refreshes or rebuilds statistics whenever tasks/subscriptions change.

- `src/observers/taskEventSubject.js`: Subject in the Observer pattern that stores observers and broadcasts events. Controllers notify this subject after state-changing operations.

### `src/routes/`

- `src/routes/index.js`: Central route table that maps HTTP endpoints to controllers. It also applies `requireAuth` middleware to protected owner routes.

### `src/views/`

- `src/views/authView.js`: Generates minimal HTML for login and registration pages. It keeps authentication UI separate from controller logic.

- `src/views/helpers.js`: Shared view utilities such as HTML escaping and the base page layout wrapper. Other views call these helpers to avoid duplication.

- `src/views/homeView.js`: Renders the public task board with subscribe forms. This is the default entry UI for volunteers.

- `src/views/ownerView.js`: Renders the owner dashboard for task creation, task management, and volunteer dismissal. It displays owned tasks and volunteer lists.

- `src/views/statsView.js`: Renders the active-task statistics table. It provides the T8 statistics output route.

- `src/views/volunteerView.js`: Renders volunteer lookup UI and result table for subscriptions by identifier. It reflects current database state after owner dismissals.
