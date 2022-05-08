import { NextFunction, Request, Response } from "express";
import Game from "../models/Game";
import determineWinner from "../utils/determineWinner";
import jwt from "jsonwebtoken";

export const getGames = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    throw "Error with headers in request";
  }

  const decodedToken: any | undefined = jwt.decode(token);

  if (!decodedToken) {
    res.status(500).json({
      error: "Can't decode token sent in request",
    });
  }
  if (decodedToken) {
    const userId = decodedToken.userId;

    Game.find({
      $or: [{ "player1.id": userId }, { "player2.id": userId }],
    })
      .sort("date -1")
      .then((games) => {
        res.status(200).json(games);
      })
      .catch((error) => {
        res.status(400).json({
          error,
        });
      });
  }
};

export const createGame = (req: Request, res: Response, next: NextFunction) => {
  const player1 = { id: req.body.player1, score: req.body.score1 };
  const player2 = { id: req.body.player2, score: req.body.score2 };
  const winner = determineWinner(player1, player2);
  Game.create({
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    player1: {
      id: req.body.player1,
      score: req.body.score1,
      scrabbles: req.body.scrabbles1,
    },
    player2: {
      id: req.body.player2,
      score: req.body.score2,
      scrabbles: req.body.scrabbles2,
    },
    winner: winner,
    type: winner ? "Victory" : "Draw",
  })
    .then(() => res.status(200).json({ message: "Game successfully created" }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error while creating Game", error });
    });
};
