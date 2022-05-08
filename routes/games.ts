import express from "express";
import { getGames, createGame } from "../controllers/games";
import { auth } from "../middlewares/auth";

export const gamesRoutes = express.Router();

gamesRoutes.get("/", auth, getGames);
gamesRoutes.post("/", auth, createGame);
