const jwt = require("jsonwebtoken");
const { error } = require("../Utils/responseWrapper");

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const { growthxtoken } = req.cookies;

    if (!growthxtoken) {
      return res.status(401).send(error(401, "Authentication token is missing"));
    }

    try {
      const decoded = jwt.verify(growthxtoken, process.env.JWT_SECRET_KEY);

      // Check if the role in the token matches the required role
      if (decoded.role !== requiredRole) {
        return res.status(403).send(error(403, "Access denied. Insufficient permissions"));
      }

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).send(error(401, "Invalid or expired token"));
    }
  };
};

module.exports = checkRole;
