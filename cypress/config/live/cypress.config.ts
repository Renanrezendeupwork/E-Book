import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "fxqiik",
  env: {
    teacher_email: "testing@flangoo.com",
    teacher_password: "Vb3TvB_RWe=L40AW2",
  },
  e2e: {
    baseUrl: "https://flangoo.com/",
    defaultCommandTimeout: 10000,
    video: true,
    scrollBehavior: "center",
    env: {
      localhost: false,
      teacher_id: 29500,
      graphql: "api.flangoo.com",
      teacher_email: "testing@flangoo.com",
      teacher_password: "Vb3TvB_RWe=L40AW2",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
