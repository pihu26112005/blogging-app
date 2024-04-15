const jwt = require('jsonwebtoken');
const secret = 'piyush';

function creatTokenforUser(user) {
    const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
        profileImageURL : user.profileImageURL
    };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    // console.error(err);
    return null;
  }
}

module.exports = {
    creatTokenforUser,
    validateToken
}