# Team Project repo
[![Build Status](https://app.travis-ci.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3.svg?branch=develop)](https://app.travis-ci.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3)
[![Coverage Status](https://coveralls.io/repos/github/gcivil-nyu-org/INET-Monday-Fall2023-Team-3/badge.svg)](https://coveralls.io/github/gcivil-nyu-org/INET-Monday-Fall2023-Team-3)
### Overview
 
"SMOOTH" is a task and dependency management program designed to streamline curriculum planning at NYU. Users can create nodes representing tasks or courses and establish dependencies between them by drawing edges. This allows for an intuitive visualization of curriculum structure and dependencies.

### Getting Started
- Prerequisites: pip, npm, docker-compose
- Installation: 
  - clone the repository
  - make sure you have docker installed: https://docs.docker.com/compose/install/. You may want to go over the tutorials in Docker Desktop (they will automatically pop up once you sign in). 
  - cd into the repository, run `docker compose up -d`. The -d flag tells docker to compose containers in detached mode. This way, you don't have to manually install the dependencies, which is frustrating and takes hours to figure out. 
  - once you have completed the above, go to the multi-container app in Docker Desktop, and click on the url of the front end container. It should be something like 80:3000/
  

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
