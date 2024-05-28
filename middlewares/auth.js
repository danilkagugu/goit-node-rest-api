import jwt from "jsonwebtoken";
import User from "../models/users.js";
import HttpError from "../helpers/HttpError.js";

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader !== "string") {
    return res.status(401).send({ message: "Not authorized" });
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Not authorized" });
    }
    try {
      const user = await User.findById(decoded.id);
      if (user === null) {
        throw HttpError(401);
      }
      if (user.token !== token) {
        throw HttpError(401);
      }
      req.user = {
        id: decoded.id,
        email: decoded.email,
        subscription: decoded.subscription,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
};
export default auth;
