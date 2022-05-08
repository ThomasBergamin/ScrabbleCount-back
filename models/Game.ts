import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
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
    commentaires: { type: String },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
