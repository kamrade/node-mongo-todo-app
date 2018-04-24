const mongoose  = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { pick } = require('lodash');
const secret   = require('../data/secret');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 4
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// override toJSON method
UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  return pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  let user   = this;
  let access = 'auth';
  let token  = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, secret).toString();

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch(e) {
    // return new Promise((resolve, reject) => { reject() })
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

let User = mongoose.model('User', UserSchema);

module.exports = { User };
