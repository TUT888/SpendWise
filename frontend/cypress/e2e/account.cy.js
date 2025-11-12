describe("SpendWise E2E account management test", () => {
  // Setup
  process.env.ACCOUNT_SERVICE_URL = process.env.ACCOUNT_SERVICE_URL || `http://localhost:3030`;
  process.env.EXPENSE_SERVICE_URL = process.env.EXPENSE_SERVICE_URL || `http://localhost:3032`;
  console.log(`E2E expense management with accountsvc: ${process.env.ACCOUNT_SERVICE_URL}, expensesvc: ${process.env.EXPENSE_SERVICE_URL}`);

  const frontend_url = `http://localhost:${process.env.PORT || 3081}/`;
  const account_url = process.env.ACCOUNT_SERVICE_URL;
    
  // Prepare test data
  const testUserName = "Sample Test User";
  const testUserEmail = "sampletestuser222@gmail.com";
  const testUserPass = "sampletestuser";

  describe("User authentication test", () => {
    after(() => {
      cy.request('DELETE', `${account_url}/api/account`, { email: testUserEmail, password: testUserPass })
    })

    it("Should register successfully", () => {
      cy.visit(frontend_url);
      cy.get('a[href="/register"]').should("exist").click();
      cy.get('input[id="input_name"]').should("exist").type(testUserName, { force: true });
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="register_btn"]').click();
    })

    it("Should login successfully", () => {
      cy.visit(frontend_url);
      cy.get('a[href="/login"]').should("exist").click();
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="login_btn"]').click();

      cy.get('a[href="/expense"]').should("exist").click();
      cy.url().should('contain', '/expense');
      cy.get('a[href="/account"]').should("exist").click();
      cy.url().should('contain', '/account');
    })

    it("Should logout successfully", () => {
      cy.visit(frontend_url);
      cy.get('a[href="/login"]').should("exist").click();
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="login_btn"]').click();

      cy.get('button[id="logout_button"]').should("exist").click();
      cy.get('a[href="/expense"]').should("not.exist");
      cy.get('a[href="/account"]').should("not.exist");
      cy.get('button[id="logout_button"]').should("not.exist");
    })
  })
})