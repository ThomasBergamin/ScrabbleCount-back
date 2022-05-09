import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: { unique: true, expires: "7d" },
  },
  userId: {
    type: String,
    required: true,
    index: { unique: true, expires: "7d" },
  },
});

const RefreshToken = mongoose.model("Token", tokenSchema);

export default RefreshToken;
