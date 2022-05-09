import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";

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
