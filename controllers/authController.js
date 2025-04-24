const db = require('../db/database');
const bcrypt = require('bcrypt');

exports.registerForm = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('auth/register', { error: 'Registrering feilet' });
  }
};

exports.loginForm = (req, res) => {
  res.render('auth/login');
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.execute('SELECT * FROM Users WHERE username = ?', [
      username,
    ]);

    if (users.length === 0) {
      return res.render('auth/login', {
        error: 'Ugyldig brukernavn eller passord',
      });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.render('auth/login', {
        error: 'Ugyldig brukernavn eller passord',
      });
    }

    req.session.userId = user.user_id;
    req.session.username = user.username;
    res.redirect('/questions');
  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Innlogging feilet' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.deleteAccount = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const [questions] = await db.execute(
      'SELECT COUNT(*) AS questionCount FROM Questions WHERE user_id = ?',
      [req.session.userId]
    );

    if (questions[0].questionCount > 0) {
      await db.execute(
        'UPDATE Users SET deletion_requested = TRUE WHERE user_id = ?',
        [req.session.userId]
      );
      req.session.destroy(() => {
        res.render('auth/delete-requested');
      });
    } else {
      await db.execute('DELETE FROM Users WHERE user_id = ?', [
        req.session.userId,
      ]);
      req.session.destroy(() => {
        res.render('auth/account-deleted');
      });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/profile?error=delete_failed');
  }
};
