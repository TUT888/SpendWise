// require("dotenv").config();

const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = chai;

// Setup 
PORT = process.env.PORT || 3030;
process.env.NODE_ENV = process.env.NODE_ENV || "test";
require("../server");

chai.use(chaiHttp);
const server = `http://localhost:${PORT}`

const testUserName = "Sample Test User";
const testUserEmail = "sampletestuser@gmail.com";
const testUserPass = "sampletestuser";

after(async () => {
  await chai.request(server)
            .delete("/api/account")
            .set('Cookie', cookie)
            .send({ email: testUserEmail, password: testUserPass })
});

// Testing
var cookie = [];
describe("TEST Account Service API", () => {
  describe("[POST] /api/account/register", () => {
    it("Should successfully register new user", (done) => {
        chai.request(server)
          .post("/api/account/register")
          .send({
            name: testUserName,
            email: testUserEmail, 
            password: testUserPass
          })
          .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property("message", "Registration successful!");
              done();
          });
      });
  });

  describe("[POST] /api/account/login", () => {
    it("Should successfully login with created account", (done) => {
        chai.request(server)
          .post("/api/account/login")
          .send({
            email: testUserEmail, 
            password: testUserPass
          })
          .end((err, res) => {
              cookie = res.header["set-cookie"];
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property("message", "Login successful!");
              done();
          });
      });

    it("Should get login status success after logging in", (done) => {
        chai.request(server)
          .get("/api/account/status")
          .set('Cookie', cookie)
          .end((err, res) => {
              expect(res.body).to.have.property("loggedIn", true);
              done();
          });
      });
  });

  describe("[POST] /api/account/logout", () => {
    it("Should successfully logout", (done) => {
        chai.request(server)
          .post("/api/account/logout")
          .set('Cookie', cookie)
          .end((err, res) => {
              cookie = res.header["set-cookie"];
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property("message", "Logged out successfully");
              done();
          });
      });

    it("Should get login status false after logging out", (done) => {
        chai.request(server)
          .get("/api/account/status")
          .set('Cookie', cookie)
          .end((err, res) => {
              expect(res.body).to.have.property("loggedIn", false);
              done();
          });
      });
  });
})