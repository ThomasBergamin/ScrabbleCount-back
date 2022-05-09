import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import RefreshToken from "../models/RefreshTokens";
config();

export const signup = async (
  req: {
    body: {
      lastName: string;
      email: string;
      firstName: string;
      password: string;
    };
  },
  res: Response
) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.lastName ||
    !req.body.firstName
  ) {
    return res
      .status(500)
      .json({ error: "Can't create user, informations are lacking" });
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

export const login = async (req: Request, res: Response) => {
  await User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
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
            expiresIn: "7d",
          }
        );
        RefreshToken.deleteOne({ userId: user._id }).then(() =>
          RefreshToken.create({
            token: refreshToken,
            userId: user._id,
          })
            .then(() =>
              res.status(200).json({
                userId: user.id,
                token,
                refreshToken,
              })
            )
            .catch(() =>
              res.status(500).json({
                error: "Erreur interne lors de la création du token",
              })
            )
        );
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!refreshToken)
    return res.status(401).json({
      error: "Token not found",
    });

  RefreshToken.findOne({ token: refreshToken })
    .then(async (token) => {
      if (!token) return res.status(403).send("Invalid Refresh Token");
      const decodedToken: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN
          ? process.env.REFRESH_TOKEN
          : "9ea7deed-bcb5-4a83-a2cd-13d82ca9efa7"
      );
      const userId = decodedToken.userId;

      if (!userId) {
        return res.status(401).json({ error: "No user id in decoded token" });
      }
      try {
        await User.findOne({ _id: userId }).then((user) => {
          const refreshedAccessToken = jwt.sign(
            { userId },
            process.env.SECRET_TOKEN
              ? process.env.SECRET_TOKEN
              : "63dfb00a-82f0-4125-a009-d6e745ba149f",
            {
              expiresIn: "15m",
            }
          );
          res.status(200).json({
            token: refreshedAccessToken,
          });
        });
      } catch (error) {
        res.status(403).json({ error: "User not found in database" });
      }
    })
    .catch(() => {
      res.status(500).send("Internal server error");
    });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!refreshToken) return;
  RefreshToken.deleteOne({ token: refreshToken }).then(() => res.status(204));
};

export const checkToken = async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!refreshToken) res.sendStatus(404);
  RefreshToken.findOne({ token: refreshToken }).then((token) => {
    if (!token) {
      res.status(404);
    } else {
      res.status(204).json({ message: "Authenticated" });
    }
  });
};
