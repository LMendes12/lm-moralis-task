# Moralis - QA Task for Lúcia Mendes

## Description

I developed the tests based on the provided tasks, focusing on demonstrating my thought process and the overall structure of the tests and the project, rather than attempting to cover every possible scenario.
You'll be able to see comments throughout the code whenever I felt some explanation was needed.

Finally, I struggled with the UI tests because of the reCaptcha at Login. I was not able to bypass it (I guess there is no bug there 😄) but that held me back to check if my UI tests were actually working or not.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/LMendes12/moralis.git
   
2. Navigate to the project directory
   ```bash
   cd lm-moralis-task
3. Initialize a new Node.js project
   ```bash
   npm init -y
4. Install Cypress and other dependencies
   ```bash
   npm install cypress
5. Create a .env file at the root of the project with the following structure
    ```bash
    # RPC API KEY
    RPC_API_KEY = ADD_YOUR_RPC_API_KEY_HERE

    # Web3 Data API
    WEB3_API_KEY = ADD_YOUR_WEB3_API_KEY_HERE
    
    # LOGIN CREDENTIALS
    USERNAME = EMAIL_FOR_MORALIS_ADMIN
    PASSWORD = PASSWORD_FOR_MORALIS_ADMIN

6. Create a config.js file for the k6 load tests, this should be created under cypress/load-tests
    ```bash
    export const config = {
        apiAddress: "https://deep-index.moralis.io/api/v2.2",
        walletAddress: "0xff3879b8a363aed92a6eaba8f61f1a96a9ec3c1e",
        web3ApiKey: ADD_YOUR_WEB3_API_KEY_HERE
    }
    
## Usage
To initialize the project and open Cypress, run there are 4 differents scripts to run
    ```bash
    "cy:test": "npx cypress open",  --> Use to run Cypress from Cypress Test Runner
    
    "cy:test:headless": "npx cypress run --headless --browser chrome > cypress_report.txt", --> Run the cypress tests headless and generate a txt report
    
    "k6": "k6 run --out csv=k6_report.csv cypress/load-tests/k6_load_tests.js", --> Run the k6 tests and generate a csv report
    
    "moralis:all": "npm run cy:test:headless && npm run k6" --> run both headless and k6 tests combined

## Running Tests
In the terminal, at the root of the project run

    npm run moralis:all

   
