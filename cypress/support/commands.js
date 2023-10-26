// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("login", () => {
  cy.visit("/", { failOnStatusCode: false });
  cy.get(".btn-primary:first").click();
  cy.clearCookies();
  cy.clearLocalStorage();
  const email = Cypress.env("teacher_email");
  const password = Cypress.env("teacher_password");
  cy.get("#login_data").type(email);
  cy.get("#password").type(password);
  cy.get("#login-button").click();
  cy.waitGQL();
  cy.get(".books_page").should("be.visible");
});

Cypress.Commands.add("loginStudent", () => {
  cy.visit("/", { failOnStatusCode: false });
  cy.get(".btn-primary:first").click();
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.fixture("student").then((student) => {
    // load data from logo.png
    const login_code = student.code;
    const password = student.password;
    cy.get("#login_data").type(login_code);
    cy.get("#password").type(password);
    cy.get("#login-button").click();
    cy.waitGQL();
  });

  cy.waitGQL();
  cy.checkIfExists("#student_modal").then((exist) => {
    if (exist) {
      cy.wait(3000);
      cy.get("#remove_modal_button").click();
    }
  });
});

Cypress.Commands.add("waitGQL", () => {
  cy.intercept({
    method: "POST",
    url: "/graphql",
    hostname: Cypress.env("graphql"),
    https: Cypress.env("localhost") ? false : true,
  }).as("GraphQL");
  cy.wait("@GraphQL").then(console.log);
  cy.wait("@GraphQL").its("response.statusCode").should("equal", 200);
});

Cypress.Commands.add("checkIfExists", (ele) => {
  cy.get("body").then(($body) => {
    if ($body.find(ele).length) {
      return true;
    }
    return false;
  });
});

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
