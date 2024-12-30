const db = require('../config/database'); // Assuming you're using a database connection module

const User = {
  create: (user) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [user.username, user.email, user.password], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.query(query, [email], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }
};

module.exports = User;
