import express from "express";
import {
  getGames,
  createGame,
  getGame,
  deleteGame,
} from "../controllers/games";
import { auth, permissionControl } from "../middlewares/auth";

export const gamesRoutes = express.Router();

gamesRoutes.get("/", auth, getGames);
gamesRoutes.get("/:id", auth, getGame);
gamesRoutes.delete("/:id", auth, permissionControl, deleteGame);
gamesRoutes.post("/", auth, createGame);
