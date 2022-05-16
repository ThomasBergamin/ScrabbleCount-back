import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import Game from "../models/Game";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  console.log("Checking authentication");
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      res.status(400).json({ error: "Error with headers in request" });
    }
    if (token) {
      const decodedToken: any = jwt.verify(
        token,
        process.env.SECRET_TOKEN
          ? process.env.SECRET_TOKEN
          : "63dfb00a-82f0-4125-a009-d6e745ba149f"
      );
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !== userId) {
        res
          .status(403)
          .json({ error: "User ID non autorisé à faire cette requête" });
      } else {
        console.log("Authentication successful");
        next();
      }
    }
  } catch (error: any) {
    console.log("Authentication was not successful");
    res.status(401).json({ error: error || "Requête non authentifiée" });
  }
};

export const permissionControl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Checking permissions");
  const gameId = req.params.id;

  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    if (!token) {
      throw "Error with headers in request";
    }
    const decodedToken: any = jwt.verify(
      token,
      process.env.SECRET_TOKEN
        ? process.env.SECRET_TOKEN
        : "63dfb00a-82f0-4125-a009-d6e745ba149f"
    );
    const userId = decodedToken.userId;

    Game.findById(gameId).then((game) => {
      if (game.player1.id === userId || game.player2.id === userId) {
        console.log("Permissions : OK");
        next();
      } else {
        console.log("Permissions : NO");
        res.status(403).json({
          message: "User ID non autorisé à modifier cet objet",
        });
      }
    });
  } catch (error: any) {
    console.log("Permissions : ERROR");
    res.status(401).json({ error: error });
  }
};
