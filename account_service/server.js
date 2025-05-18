require("dotenv").config();

// Setup server
const express = require("express");

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Config session middlewares
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "user_sessions"
});
app.use(session({
    secret: process.env.SESSION_SECRET || "MySecret",
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      // maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      maxAge: 1000 * 60 * 15 // 15 min
    },
  })
);

require("./database/connectDB");
app.use("/api/account", require('./routes/accountRouter'))

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;