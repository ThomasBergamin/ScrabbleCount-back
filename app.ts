import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { authRoutes } from "./routes/auth";
import { gamesRoutes } from "./routes/games";
import { playersRoutes } from "./routes/players";
config();

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error: string) =>
    console.log("Connexion à MongoDB échouée ! " + error)
  );

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/players/", playersRoutes);
export default app;
