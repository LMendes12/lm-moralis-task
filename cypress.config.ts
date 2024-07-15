import { defineConfig } from 'cypress';
import fs from 'fs';
import { config } from "dotenv";

//Load variables from the .env file
config();

const configFile = `cypress/config/cypress.moralis.json`
const configFileContent = fs.readFileSync(configFile, 'utf8')

let environmentConfig: any = {}

try {
  environmentConfig = JSON.parse(configFileContent);
  environmentConfig.env.apiKey = process.env["RPC_API_KEY"];

} catch (error: any) {
  console.error(`Error reading configuration file: ${error.message}`)
}

export default defineConfig({
  ...environmentConfig,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});
