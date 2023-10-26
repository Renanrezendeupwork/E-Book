import Chance from "chance";

describe("Create a new Student", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });
  const chance = new Chance();
  it("Sign In", { defaultCommandTimeout: 20000 }, () => {
    cy.login();
  });

  it("Add a new class if empty", () => {
    cy.get("#user_nav").click();
    cy.get("#nav_item__students").click();
    cy.waitGQL();
    cy.wait(5000);
    cy.get("#bar_loader").should("not.exist");
    ///add class if empty
    if (cy.checkIfExists("#no_students_jumbo")) {
      cy.get("#add_class_btn").click();
      cy.get("#class_name").type(chance.city());
      cy.get("#add_class_fun").click();
      ////wait for the class to be added
      cy.waitGQL();
    }
    cy.get("#bar_loader").should("not.exist");
    cy.get("#class_modal").should("not.exist");
  });
  it("Add a new student", () => {
    const student = {
      firstName: chance.first(),
      lastName: chance.last(),
    };
    student.id = (student.firstName + student.lastName)
      .toLowerCase()
      .split(" ")
      .join("");
    cy.wait(5000);
    cy.get("#add_students_btn").click();
    cy.get("#add_students_btn_manual").click();
    cy.waitGQL();
    cy.get("#first_name").type(student.firstName);
    cy.get("#last_name").type(student.lastName);
    cy.get("#class_id").select(1); // select random class
    cy.get("#save_student").click();
    ////wait for students to  load
    cy.waitGQL();
    ///get student login code
    cy.get(`#${student.id}_code`)
      .invoke("text")
      .then((text) => {
        cy.log(text);
        student.code = text;
      });
    student.password = "changeme";
    cy.writeFile("cypress/fixtures/student.json", student);
    cy.get("#stuents_table").should("be.visible");
  });
});
