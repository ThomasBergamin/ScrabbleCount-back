import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  checkToken,
} from "../controllers/auth";

export const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/refreshToken", refreshToken);
authRoutes.post("/checkToken", checkToken);
authRoutes.delete("/logout", logout);
