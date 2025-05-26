describe("SpendWise E2E homepage test", () => {
  const frontend_url = "http://localhost:3081/";
  
  describe("Homepage test", () => {
    beforeEach(() => {
      cy.visit(frontend_url);
    })
    it("Should include welcome heading", () => {
      cy.contains("Welcome");
    })
  })

  describe("Navigation bar test", () => {
    beforeEach(() => {
      cy.visit(frontend_url);
    })
    
    it('Should include clickable login button', () => {
      cy.get('a[href="/login"]').should("exist").click();
      cy.url().should('contain', '/login');
    })
    it('Should include clickable register button', () => {
      cy.get('a[href="/register"]').should("exist").click();
      cy.url().should('contain', '/register');
    })
  })
})