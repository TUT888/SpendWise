// require("dotenv").config();

const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = chai;

// Setup 
chai.use(chaiHttp);

PORT = process.env.PORT || 3032;
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret";
process.env.ACCOUNT_SERVICE_URL = `http://localhost:${PORT}`

const accountServer = require("../../account_service/server");
const expenseServer = require("../server");

const testUserName = "Sample Test User";
const testUserEmail = "sampletestuser22222@gmail.com";
const testUserPass = "sampletestuser22222";

var token = '';
before(async () => {
  await chai.request(accountServer)
            .post("/api/account")
            .set('Authorization', `Bearer ${token}`)
            .send({ name: testUserName, email: testUserEmail, password: testUserPass })
})

after(async () => {
  await chai.request(accountServer)
            .delete("/api/account")
            .set('Authorization', `Bearer ${token}`)
            .send({ email: testUserEmail, password: testUserPass })
});

// Testing
var expense_id = "";
describe("TEST Expense Service API", () => {
  describe("[POST] /api/auth/login", () => {
    it("Should successfully login first", (done) => {
        chai.request(accountServer)
          .post("/api/auth/login")
          .send({ email: testUserEmail, password: testUserPass })
          .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property("message", "Login successful!");
              expect(res.body).to.have.property("token");
              token = res.body.token;
              done();
          });
      });
  })
  
  describe("[POST] /api/expense", () => {
    it("Should successfully add expense", (done) => {
        chai.request(expenseServer)
            .post("/api/expense")
            .set('Authorization', `Bearer ${token}`)
            .send({
              user_email: testUserEmail, 
              amount: 10, 
              description: "Sample description", 
              category_name: "Sample category"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success", true);
                expect(res.body).to.have.property("message", "Add expense successful!");
                done();
            });
      });
  })

  describe("[GET] /api/expense", () => {
    it("Should successfully get all expense", (done) => {
        chai.request(expenseServer)
            .get(`/api/expense?user_email=${testUserEmail}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.expense).to.be.an("array");
                expense_id = res.body.expense[0]._id
                done();
            });
      });
  })

  describe("[PUT] /api/expense", () => {
    it("Should successfully update expense", (done) => {
        chai.request(expenseServer)
            .put("/api/expense")
            .set('Authorization', `Bearer ${token}`)
            .send({
              expense_id: expense_id, 
              amount: 20, 
              description: "New description", 
              category_name: "New category"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success", true);
                expect(res.body).to.have.property("message", "Update expense successful!");
                done();
            });
      });
  })

  describe("[DELETE] /api/expense", () => {
    it("Should successfully delete expense", (done) => {
        chai.request(expenseServer)
            .delete("/api/expense")
            .set('Authorization', `Bearer ${token}`)
            .send({ expense_id: expense_id })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success", true);
                expect(res.body).to.have.property("message", "Delete expense successful!");
                done();
            });
      });
  })
});