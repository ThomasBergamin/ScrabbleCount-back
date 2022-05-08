import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const tokenList: any = {};

export const signup = async (
  req: {
    body: {
      lastName: string;
      email: string;
      firstName: string;
      password: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    return res
      .status(500)
      .json({ message: "Can't create user, informations are lacking" });
  }
  const hash = await bcrypt.hash(req.body.password, 10);
  await User.create({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    password: hash,
    email: req.body.email,
  })
    .then(() => res.status(200).json({ message: "User successfully created" }))
    .catch((error) =>
      res.status(500).json({ message: "Error while creating user", error })
    );
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      console.log(user); // TODO : remove console.log used for dev purposes
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        const token = jwt.sign(
          { userId: user._id },
          process.env.SECRET_TOKEN
            ? process.env.SECRET_TOKEN
            : "63dfb00a-82f0-4125-a009-d6e745ba149f",
          {
            expiresIn: "15m",
          }
        );
        const refreshToken = jwt.sign(
          { userId: user._id },
          process.env.REFRESH_TOKEN
            ? process.env.REFRESH_TOKEN
            : "9ea7deed-bcb5-4a83-a2cd-13d82ca9efa7",
          {
            expiresIn: "24h",
          }
        );
        tokenList[refreshToken] = { token, refreshToken };
        res.status(200).json({
          userId: user.id,
          token,
          refreshToken,
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const decodedToken: any = jwt.verify(
    token,
    process.env.REFRESH_TOKEN
      ? process.env.REFRESH_TOKEN
      : "9ea7deed-bcb5-4a83-a2cd-13d82ca9efa7"
  );
  const userId = decodedToken.userId;

  if (!userId) {
    return res.status(401).json({ message: "No user id in decoded token" });
  }

  if (decodedToken && decodedToken in tokenList) {
    await User.findOne({ _id: userId })
      .then((user) => {
        const refreshedToken = jwt.sign(
          userId,
          process.env.SECRET_TOKEN
            ? process.env.SECRET_TOKEN
            : "63dfb00a-82f0-4125-a009-d6e745ba149f",
          {
            expiresIn: "15m",
          }
        );
        tokenList[decodedToken.refreshToken].token = token;
        res.status(200).json({
          token: refreshedToken,
        });
      })
      .catch(() => {
        res.status(403).json({ message: "User not found in database" });
      });
  } else {
    res.status(404).send("Invalid request");
  }
};
