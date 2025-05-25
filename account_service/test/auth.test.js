// require("dotenv").config();
const User = require("../models/user");

const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = chai;

// Setup 
chai.use(chaiHttp);
const server = require("../server");
const { logger } = require("../logger");

const testUserName = "Sample Test User";
const testUserEmail = "sampletestuser@gmail.com";
const testUserPass = "sampletestuser";

before(() => {
  logger.silent = true;
})

after(async () => {
  logger.silent = false;
  await User.deleteMany({ email: testUserEmail })
});

// Testing
describe("[POST] /register", () => {
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

describe("[POST] /login", () => {
  it("Should successfully login with created account", (done) => {
      chai.request(server)
        .post("/api/account/login")
        .send({
          email: testUserEmail, 
          password: testUserPass
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("success", true);
            expect(res.body).to.have.property("message", "Login successful!");
            done();
        });
    });
});

describe("[POST] /logout", () => {
  it("Should successfully logout", (done) => {
      chai.request(server)
        .post("/api/account/logout")
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("success", true);
            expect(res.body).to.have.property("message", "Logged out successfully");
            done();
        });
    });
});