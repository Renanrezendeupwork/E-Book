import { defineConfig } from "cypress";
import user from "./cypress/fixtures/user.json";

//random number from 1 to 5
const randomNumber = Math.floor(Math.random() * 5) + 1;

export default defineConfig({
  projectId: "fxqiik",
  env: {
    teacher_email: user.email,
    teacher_password: user.password,
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    defaultCommandTimeout: 10000,
    video: false,
    env: {
      localhost: true,
      graphql: "localhost",
      teacher_id: randomNumber,
      teacher_email: user.email,
      teacher_password: user.password,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
