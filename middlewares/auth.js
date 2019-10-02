const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require('dotenv').config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;

    return next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalid" });
  }
};
