const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const token  = jwt.sign({id},process.env.TOKEN_SECRET, {
    expiresIn: "30d"
  });
  return token;
};


module.exports={
    generateToken
}