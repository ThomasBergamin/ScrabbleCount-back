import express from "express";
import { getPlayers } from "../controllers/players";
import { auth } from "../middlewares/auth";

export const playersRoutes = express.Router();

playersRoutes.get("/", auth, getPlayers);
