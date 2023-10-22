# Team Project repo

### Overview
 
"SMOOTH" is a task and dependency management program designed to streamline curriculum planning at NYU. Users can create nodes representing tasks or courses and establish dependencies between them by drawing edges. This allows for an intuitive visualization of curriculum structure and dependencies.

### Getting Started
- Prerequisites: pip, npm
- Installation: 
  - clone the repository
  - cd into the folder named 'backend'
  - run `pip install -r requirements.txt` 
  - run `python -m venv venv_name`
  - run `python manage.py migrate`
  - test that the backend server runs successfully: `python manage.py runserver`
  - cd into the folder named 'frontend' `cd ../frontend`
  - run `npm run build`
  - run `npm start`

### Project Layout
1. frontend/: This directory houses the React application responsible for visualizing and interacting with tasks and their dependencies.
   * next.config.js: Configures route rewrites to proxy API calls to the backend, easing development and eliminating cross-origin request issues.
   - package.json: Specifies frontend dependencies and scripts.

2. backend/: Contains server-side components that offer API endpoints, handle task logic, and manage database interactions.
   - views.py: Defines API endpoints for user operations and task management.
   - models.py: (or equivalent) Represents database entities, such as tasks and their relationships.

3. Dockerfile: Located in the root or respective directories, this file provides instructions to Docker for building a containerized version of the application, ensuring consistent runtime environments.

Communication Flow:
The frontend, developed using React, makes API calls to specific routes, such as /backend/user/ping. Through the configuration in next.config.js, these requests are proxied to the backend server, typically at an address like http://backend:8000/user/ping/. The backend then processes these requests, interacts with the database if necessary, and returns appropriate responses back to the frontend.
