import Chance from "chance";
describe("Test Teacher Flow", () => {
  const chance = new Chance();
  const lastname = chance.last();
  const user = {
    name: `Test ${lastname}`,
    email: `test_${lastname.toLocaleLowerCase()}@flangoo.com`,
    password: "demo123",
  };
  it("Signup", { defaultCommandTimeout: 20000 }, () => {
    cy.log("page:", window.location.href);
    cy.visit("/signup", { failOnStatusCode: false });
    cy.get("#name").type(user.name);
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get("#flangoospanish").click();
    cy.get("#signup_button").click();
    cy.waitGQL();
    if (Cypress.env("localhost")) {
      cy.writeFile("cypress/fixtures/user.json", user);
    }
    cy.wait(3000);
    const new_user = JSON.parse(localStorage.getItem("user") || "{}");
    cy.log(new_user);
    if (new_user) {
      user.id = new_user.id;
    }
    cy.get(".books_page").should("be.visible");
  });
});
