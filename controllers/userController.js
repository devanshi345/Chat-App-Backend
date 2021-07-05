const mongoose = require("mongoose");
const User = mongoose.model("User");
const salt = require("js-sha256");
const jwt = require("jwt-then");

exports.login = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({
    email,
    password: salt(password + process.env.SALT)
  });

  if(!user)
  {
    throw "Email or password incorrect!";
  }

  const token = await jwt.sign({id: user.id}, process.env.SECRET);

  res.json({
    message: "User logged in successfully!",
    token
  });

};

exports.register = async (req, res) => {
  const {name, email, password} = req.body;

  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com$/;
  if (!emailRegex.test(email))
  {
    throw "Email domain is not supported.";
  }
  if (password.length < 8)
  {
    throw "Password must be atleast 8 characters long.";
  }

  const userAlreadyExists = await User.findOne({
    email
  });

  if(userAlreadyExists)
  {
    throw "User with same email already exists!";
  }

  const user = new User({ name, email, password: salt(password + process.env.SALT) });

  await user.save();

  res.json({
    message: "User [" + name + "] registered successfully!"
  });
};
