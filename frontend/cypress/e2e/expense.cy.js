describe("SpendWise E2E account management test", () => {
  // Setup
  process.env.ACCOUNT_SERVICE_URL = process.env.ACCOUNT_SERVICE_URL || `http://localhost:3030`;
  process.env.EXPENSE_SERVICE_URL = process.env.EXPENSE_SERVICE_URL || `http://localhost:3032`;
  console.log(`E2E account management with accountsvc: ${process.env.ACCOUNT_SERVICE_URL}, expensesvc: ${process.env.EXPENSE_SERVICE_URL}`);

  const frontend_url = `http://localhost:${process.env.PORT || 3081}/`;
  const account_url = process.env.ACCOUNT_SERVICE_URL;
  
  // Prepare test data
  const testUserName = "Sample Test User";
  const testUserEmail = "sampletestuser222@gmail.com";
  const testUserPass = "sampletestuser";

  var testCategory = "Test category";
  var testDesciption = "Test description";
  var testAmount = 10;

  describe("User authentication test", () => {
    before(() => {
      cy.visit(frontend_url);
      cy.get('a[href="/register"]').should("exist").click();
      cy.get('input[id="input_name"]').should("exist").type(testUserName, { force: true });
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="register_btn"]').click();
    })

    after(() => {
      cy.request('DELETE', `${account_url}/api/account`, { email: testUserEmail, password: testUserPass })
    })
    
    it("Should add expense successfully", () => {
      // Login
      cy.visit(frontend_url);
      cy.get('a[href="/login"]').should("exist").click();
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="login_btn"]').click();

      // Add expense
      cy.get('a[href="/expense"]').should("exist").click();
      cy.get('button[id="open-add-expense-form"]').should("exist").click();

      cy.get('input[id="input_category"]').should("exist").type(testCategory, { force: true });
      cy.get('input[id="input_description"]').should("exist").type(testDesciption, { force: true });
      cy.get('input[id="input_amount"]').should("exist").type(testAmount, { force: true });
      cy.get('button[id="add_expense_btn"]').click();

      // Check result
      cy.contains(testCategory);
      cy.contains(testDesciption)
      cy.contains(testAmount)
    })

    it("Should get expense successfully", () => {
      // Login
      cy.visit(frontend_url);
      cy.get('a[href="/login"]').should("exist").click();
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="login_btn"]').click();

      // Check existing expense
      cy.get('a[href="/expense"]').should("exist").click();

      // Check result
      cy.contains(testCategory);
      cy.contains(testDesciption)
      cy.contains(testAmount)
    })
    
    it("Should update expense successfully", () => {
      // Login
      cy.visit(frontend_url);
      cy.get('a[href="/login"]').should("exist").click();
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="login_btn"]').click();

      // Check existing expense
      cy.get('a[href="/expense"]').should("exist").click();
      cy.contains(testCategory);
      cy.contains(testDesciption)
      cy.contains(testAmount)

      // Update expense
      testAmount = testAmount + 20;
      cy.get('button[class="btn btn-sm btn-primary edit-expense-btn"]').should("exist").click();
      cy.get('input[id="input_amount"]').should("exist").type(testAmount, { force: true });
      cy.get('button[id="edit_expense_btn"]').click();

      // Check result
      cy.contains(testAmount);
    })

    it("Should delete expense successfully", () => {
      // Login
      cy.visit(frontend_url);
      cy.get('a[href="/login"]').should("exist").click();
      cy.get('input[id="input_email"]').should("exist").type(testUserEmail, { force: true });
      cy.get('input[id="input_password"]').should("exist").type(testUserPass, { force: true });
      cy.get('button[id="login_btn"]').click();

      // Check existing expense
      cy.get('a[href="/expense"]').should("exist").click();
      cy.contains(testCategory);
      cy.contains(testDesciption)
      cy.contains(testAmount)

      // Delete expense
      cy.get('button[class="btn btn-sm btn-danger delete-expense-btn"]').should("exist").click();
      
      // Check result
      cy.contains('.selector', testCategory).should('not.exist');
      cy.contains('.selector', testDesciption).should('not.exist');
      cy.contains('.selector', testAmount).should('not.exist');
    })
  })
})