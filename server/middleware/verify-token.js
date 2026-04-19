import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!payload?.userId) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.userId = payload.userId;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token is not valid or expired",
    });
  }
};
