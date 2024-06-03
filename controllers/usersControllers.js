import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";
import HttpError from "../helpers/HttpError.js";

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const avatarUrl = gravatar.url(email, { protocol: "http", format: "png" });
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const addUser = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatarUrl,
    });

    res.status(201).send({
      user: {
        email,
        subscription: addUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, subscription: user.subscription },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    res.status(200).send({
      token,
      user: { email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
export const currentUser = (req, res, next) => {
  try {
    res
      .status(200)
      .send({ email: req.user.email, subscription: req.user.subscription });
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400);
    const avatarSize = await Jimp.read(req.file.path);

    await avatarSize.resize(256, 256).writeAsync(req.file.path);
    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", req.file.filename)
    );
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      { new: true }
    );
    res.status(201).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
