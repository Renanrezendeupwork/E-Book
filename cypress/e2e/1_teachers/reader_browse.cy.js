describe("Test Reader Browsing as Teacher", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("Sign In", { defaultCommandTimeout: 20000 }, () => {
    cy.login();
  });
  it("Browse Random Reader", { defaultCommandTimeout: 20000 }, () => {
    cy.waitGQL();
    cy.wait(2000);
    const random_y = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
    const random_x = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
    const down = "{downArrow}".repeat(random_y);
    const right = "{rightArrow}".repeat(random_x);
    cy.get("body").type(`${down}${right}{enter}{enter}`, {
      force: true,
      delay: 600,
    });
    cy.waitGQL();
    cy.get("#reader_cont").should("be.visible");
  });

  it("Test Quiz if available", { defaultCommandTimeout: 20000 }, () => {
    cy.get("#multiple_choice_btn").click();
    cy.get(".chapter_questions_container").should("be.visible");
    cy.get("body").type(
      "{1}{enter}{enter}{2}{enter}{enter}{1}{enter}{enter}{2}{enter}{enter}{2}{enter}{enter}",
      {
        force: true,
        delay: 800,
      }
    );
    cy.get(".chapter_questions_resume").should("be.visible");
  });
});
