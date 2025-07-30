import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorisation;
  if (!authHeader || !authHeader.starts.with("Bearer")) {
    return res.status(403).json({});
  }

  const token = authHeader.split("")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userid=decoded.userid;
    next();
  } catch (error) {
          return res.status(403).json({})
  }
};

export  {authMiddleware}
