master: [![Build Status](https://app.travis-ci.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3.svg?branch=master)](https://app.travis-ci.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3)
[![Coverage Status](https://coveralls.io/repos/github/gcivil-nyu-org/INET-Monday-Fall2023-Team-3/badge.svg?branch=develop)](https://coveralls.io/github/gcivil-nyu-org/INET-Monday-Fall2023-Team-3?branch=master)  
develop: [![Build Status](https://app.travis-ci.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3.svg?branch=develop)](https://app.travis-ci.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3)
[![Coverage Status](https://coveralls.io/repos/github/gcivil-nyu-org/INET-Monday-Fall2023-Team-3/badge.svg?branch=develop)](https://coveralls.io/github/gcivil-nyu-org/INET-Monday-Fall2023-Team-3?branch=develop)


## Overview
 
"SMOOTH" is a task and dependency management program designed to streamline curriculum planning at NYU. Users can create nodes representing tasks or courses and establish dependencies between them by drawing edges. This allows for an intuitive visualization of curriculum structure and dependencies.

## Getting Started
### Prerequisites

* python 3.11
* node 18

### Installation
2. Clone the repo
   ```sh
   git clone https://github.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3.git
   ```
3. Install python packages
    ```sh
    cd backend
    pip install -r requirements.txt
    ```
4. Install frontend packages
    ```sh
    cd frontend
    npm install
    ```
5. Build frontend project
    ```sh
    cd frontend
    npm run build
    ```
6. Copy frontend files to backend
    ```sh
    mkdir backend/static
    cp -r frontend/build/* backend/static
    ```
7. Migrate Django database
    ```sh
    cd backend
    python manage.py migrate
    ```
8. Run server
    ```sh
    cd backend
    python manage.py runserver
    ```

## Project Structure
```text
.
├── backend                     : backend Django server
│   ├── app                     : default Django app
│   ├── edge                    : app that handles edge related operations
│   ├── graph                   : app that handles graph related operations
│   ├── node                    : app that handles node related operations
│   ├── static                  : empty folder, put compiled frontend inside this folder
│   ├── user                    : app that handles user related operations
├── frontend                    : frontend react application
│   ├── src                     : react src
│   │   ├── components          : components on webpage
│   │   │   ├── node            : components used for node related operations
│   │   │   ├── user            : components used for user related operations
│   │   │   ├── welcome         : components used on the welcome page
│   │   ├── utils               : utils for frontend project
│   │   ├── views               : page components
```