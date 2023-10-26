describe("Test Reader Browsing as Student", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("Sign In", { defaultCommandTimeout: 20000 }, () => {
    cy.loginStudent();
  });
  it("Browse Random Reader", { defaultCommandTimeout: 20000 }, () => {
    // cy.waitGQL();
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
    cy.url().should("contain", "reader/");
    cy.get("#reader_cont").should("be.visible");
  });

  it("Check Underlined Translations", { defaultCommandTimeout: 20000 }, () => {
    cy.wait(2000);
    cy.get(".translation").should("be.visible");
  });

  it("Check that Audio is Working", { defaultCommandTimeout: 20000 }, () => {
    cy.get("#audiohold0").should("exist");
    cy.get("source")
      .invoke("attr", "src")
      .then((audiofile) => {
        const audio = new Audio(audiofile);
        if (!audio) {
          throw new Error("test fails here");
        }
      });
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

  it("Browse to next chapter", { defaultCommandTimeout: 20000 }, () => {
    cy.get("#next_chapter").click();
    cy.waitGQL();
    cy.get("#reader_cont").should("be.visible");
  });
});
