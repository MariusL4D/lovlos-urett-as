require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Importer ruterne KORREKT
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Bruk ruterne
//app.use('/', authRoutes);
//app.use('/questions', questionRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
