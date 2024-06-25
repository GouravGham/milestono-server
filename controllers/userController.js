const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = (req, res) => {
  const { fullName, email, phone, password } = req.body;
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        console.log(`User already exists with email: ${email}`);
        return res.status(409).json({ error: 'Email already in use' });
      }
      const role = "user";
      const numOfViewers = 15;
      const numOfContactDetails = 1;
      const numOfProperties = 1;
      const canContactAdmin = false;
      const newUser = new User({ fullName, email, phone, password, role, numOfViewers,numOfContactDetails,numOfProperties,canContactAdmin });
      newUser.save()
        .then(() => {
          console.log(`User registered successfully with email: ${email}`);
          res.status(201).json({ message: 'User registered successfully' });
        })
        .catch(saveErr => {
          console.error('Error saving user', saveErr);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch(err => {
      console.error('Error finding user', err);
      res.status(500).json({ error: 'Internal server error' });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
          const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.json({ token });
        })
        .catch(bcryptErr => {
          console.error(bcryptErr);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
};

const getUserDetails = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    User.findOne({ email: decoded.email })
      .then(existingUser => {
        if (existingUser) {
          return res.json(existingUser);
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      })
      .catch(err => {
        console.error('Error finding user', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};

const adminLogin = (req, res) => {
  loginUser(req, res);
};

const authenticate = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ role : decoded.role });
  });
};

const getEmail = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ email : decoded.email });
  });
};



const authenticateUser = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ message: 'User authenticated' });
  });
};

const authenticateAdmin = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ message: 'Admin authenticated' });
  });
};

const updateUserProfile = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    User.findOneAndUpdate({ email: decoded.email }, req.body, { new: true })
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(err => {
        console.error('Error updating user profile', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};

const updateUserPassword = (req, res) => {
  const token = req.headers.authorization;
  const { currentPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    User.findOne({ email: decoded.email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(currentPassword, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(401).json({ error: 'Current password is incorrect' });
            }

            bcrypt.hash(newPassword, 12)
              .then(hashedPassword => {
                user.password = hashedPassword;
                user.save()
                  .then(() => res.json({ message: 'Password updated successfully' }))
                  .catch(saveErr => {
                    console.error('Error saving new password', saveErr);
                    res.status(500).json({ error: 'Internal server error' });
                  });
              })
              .catch(hashErr => {
                console.error('Error hashing new password', hashErr);
                res.status(500).json({ error: 'Internal server error' });
              });
          })
          .catch(compareErr => {
            console.error('Error comparing passwords', compareErr);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(err => {
        console.error('Error finding user', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  authenticateUser,
  authenticateAdmin,
  getUserDetails,
  authenticate,
  updateUserProfile,
  updateUserPassword,
  getEmail,
};
