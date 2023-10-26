import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "fxqiik",
  env: {
    teacher_email: "demo@flangoo.com",
    teacher_password: "DMNpeFVD2CMS4Ay",
  },
  e2e: {
    baseUrl: "https://stage.flangoo.com/",
    defaultCommandTimeout: 10000,
    video: true,
    retries: {
      // Configure retry attempts for `cypress run`
      runMode: 3,
      // Configure retry attempts for `cypress open`
      openMode: 0,
    },
    env: {
      localhost: false,
      teacher_id: 2815,
      graphql: "apidev2.flangoo.com",
      teacher_email: "demo@flangoo.com",
      teacher_password: "DMNpeFVD2CMS4Ay",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
