require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const passport = require("passport");
const bodyParser = require('body-parser');
const session = require("express-session");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require('./models/user'); 

const { PORT, MONGO_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: "mysecretkeyisgouravgham",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

passport.use(new OAuth2Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value; 
    const phone = profile.phone || ''; 
    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({
        googleId: id,
        displayName: displayName,
        email: email,
        phone: phone,
        image: photos[0].value
      });
      
      await user.save(); 
    }

    return done(null, user); 
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use('/api', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/propertyRoutes'));
app.use('/api', require('./routes/serviceRoutes'));
app.use('/api', require('./routes/accountRoutes'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
