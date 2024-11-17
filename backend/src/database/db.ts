import mongoose, { Document, Schema } from "mongoose";
import { MONGO_DB_URI } from "../config";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface IAccount extends Document {
  userId: string;
  balance: number;
}
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 50
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
}, { timestamps: true });

const accoutSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
  balance: {type: Number, required: true},

}, {timestamps: true});

export const User = mongoose.model<IUser>("User", userSchema);
export const Account = mongoose.model<IAccount>("Account", accoutSchema);

mongoose.connect(MONGO_DB_URI).then(() => {
  return console.log("Connected to MongoDB");
}).catch(err => {
  console.log("Error while connecting on to MongoDB"); 
  console.error(err);
});


