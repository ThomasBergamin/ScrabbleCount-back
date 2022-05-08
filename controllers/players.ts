import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export const getPlayers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}, "_id firstName lastName")
    .then((players) => {
      res.status(200).json(players);
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};
