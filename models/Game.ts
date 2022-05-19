import mongoose from "mongoose";

export interface IGame {
  date: string; // DD-MM-YYYY
  time: string; // HH:MM
  location: string;
  player1: { id: string; score: string; scrabbles: string };
  player2: { id: string; score: string; scrabbles: string };
  winner?: { playerId: string; playerScore: string };
  comments?: string;
  type: "Draw" | "Victory";
}

const gameSchema = new mongoose.Schema<IGame>(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    player1: {
      id: {
        type: String,
        required: true,
      },
      score: { type: String, required: true },
      scrabbles: { type: String, required: true },
    },
    player2: {
      id: {
        type: String,
        required: true,
      },
      score: { type: String, required: true },
      scrabbles: { type: String, required: true },
    },

    winner: { playerId: { type: String }, playerScore: { type: String } },
    type: { type: String, required: true },
    comments: { type: String },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
