var Jwt = require("jsonwebtoken");
const Jwtkey = "bhavani@H123";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
  try {
    const data = Jwt.verify(token, Jwtkey);
    req.user = data.user;
    next();
  } catch {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
