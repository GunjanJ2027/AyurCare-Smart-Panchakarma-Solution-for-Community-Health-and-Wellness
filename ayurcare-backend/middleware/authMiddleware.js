// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');

// // 1. Verify if user is logged in (The basic check)
// exports.protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: "Not authorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // This contains id and role
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token failed" });
//   }
// };

// // 2. The RBAC Bouncer: Check for specific roles
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ 
//         message: `Role (${req.user.role}) is not allowed to access this resource` 
//       });
//     }
//     next();
//   };
// };

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log("--- BOUNCER CHECKING ID ---");
  
  // 1. Check what the frontend actually sent
  console.log("Headers received:", req.headers.authorization);

  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token === 'undefined' || token === 'null') {
    console.log("❌ Bouncer says: NO VALID TOKEN FOUND");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 2. Try to verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Bouncer says: TOKEN IS VALID!");
    req.user = decoded;
    next();
  } catch (error) {
    // 3. Print the exact reason it failed
    console.log("❌ Bouncer says: TOKEN REJECTED because ->", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };