require("dotenv").config();

// Setup server
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Config session middlewares
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoStore = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "user_sessions"
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      // maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      maxAge: 1000 * 60 * 1 // 3 min
    },
  })
);

// Enable CORS for frontend origin
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true // for using cookies or authentication headers
}));

require("./database/connectDB");
app.use("/api/account", require('./routes/accountRouter'))

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;