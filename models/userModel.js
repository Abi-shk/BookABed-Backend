const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid']
  },
  firstName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  todos:[{type:mongoose.Types.ObjectId,ref:"Todo"}]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

const addUser = async (email, password, firstName) => {
  const user = new User({ email, password, firstName });
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

module.exports = { addUser, findUserByEmail };
