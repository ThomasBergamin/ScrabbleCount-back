import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface IUser {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

export default User;
