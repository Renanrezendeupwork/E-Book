import Chance from "chance";

describe("Test Student Self Signup", () => {
  it("Self Sign Up", { defaultCommandTimeout: 20000 }, () => {
    const techaer_id = Cypress.env("localhost")
      ? "1"
      : Cypress.env("teacher_id");
    cy.visit(`/studentsignup/${techaer_id}`, { failOnStatusCode: false });

    cy.wait(5000);
    const student = {
      firstName: chance.first(),
      lastName: chance.last(),
      password: chance.string(),
    };

    cy.get("#first_name").type(student.firstName);
    cy.get("#last_name").type(student.lastName);
    cy.get("#password").type(student.password);
    cy.get("#class_id").select(1);
    cy.get("#create_student").click();
    cy.waitGQL();
    ///get student login code
    cy.get(`#student_logincode`)
      .invoke("text")
      .then((text) => {
        cy.log(text);
        student.code = text.trim();
      });
    cy.writeFile("cypress/fixtures/student.json", student);
    cy.checkIfExists("#student_modal").then((exist) => {
      if (exist) {
        cy.wait(5000);
        cy.get("#remove_modal_button").click();
      }
    });
    cy.get(".books_page").should("be.visible");
  });
});
