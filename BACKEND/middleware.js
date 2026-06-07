const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) { // if the header not starts with bearer
        return res.status(403).json({
            msg: "invalid token"
        })
    }

    // if token is get authorized
    const token = authHeader.split(" ")[1]?.trim(); // after the split take the 1st index elemnt in the tokemn 

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        next();

    } catch (err) {
        res.status(403).json({
            msg: "Invalid token/ user not get autheticated",
            error: err

        })

    }
}

module.exports = authMiddleware;




// Token Received
//       ↓
// Token Decoded
//       ↓
// Extract userId
//       ↓
// Attach to req object
//       ↓
// Future routes can use req.userI
