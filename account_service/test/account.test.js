// require("dotenv").config();
require("../server");
const User = require("../models/user");

const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = chai;

// Setup 
chai.use(chaiHttp);
const server = `http://localhost:${process.env.PORT || 3030}`

const { logger } = require("../logger");

const testUserName = "Sample Test User";
const testUserEmail = "sampletestuser@gmail.com";
const testUserPass = "sampletestuser";

before(() => {
  logger.silent = true;
})

after(async () => {
  logger.silent = false;
  await User.deleteOne({ email: testUserEmail })
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