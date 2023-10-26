describe.skip("Remove Teacher Account", () => {
  it("Sign In", { defaultCommandTimeout: 20000 }, () => {
    cy.login();
  });
  it("Remove Account", { defaultCommandTimeout: 20000 }, () => {
    cy.get("#user_nav").click();
    cy.pause();
    cy.get("#nav_item__youraccount").click();
    cy.pause();
    cy.get("#cancel_account").click();
    cy.wait(1000);
    cy.get("#finish_cancellation").click();
    cy.waitGQL();
    cy.get(".landing_page").should("be.visible");
  });
});
