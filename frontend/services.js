// Access services between containers
const SERVICES_INTERNAL = {
  ACCOUNT: process.env.ACCOUNT_SERVICE_URL || "",
  EXPENSE: process.env.EXPENSE_SERVICE_URL || ""
}
// Access services from outside (localhost)
const SERVICES = {
  ACCOUNT: "http://localhost:" + process.env.ACCOUNT_SERVICE_URL.split(":").pop(),
  EXPENSE: "http://localhost:" + process.env.EXPENSE_SERVICE_URL.split(":").pop()
}

module.exports = {
  SERVICES_INTERNAL,
  SERVICES
}