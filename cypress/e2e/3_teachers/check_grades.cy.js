describe("Check grades", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("Sign In", () => {
    cy.login();
  });
  it("Check if grades are showing", () => {
    cy.get("#user_nav").click();
    cy.get("#nav_item__grades").click();
    cy.waitGQL();
    cy.wait(5000);
    cy.get("#class_id").click();
    cy.focused().type(`{downArrow}{enter}`, {
      force: true,
      delay: 600,
    });
    cy.waitGQL();
    cy.get("#table_grades").should("be.visible");
  });
});
