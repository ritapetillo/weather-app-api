import { Mongoose } from "mongoose";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  google_id: string;
  defaultLocation: string;
  favoriteLocations: [string];
  comparePassword: comparePasswordFunction;
  findByEmail: findByEmail;
  _update: string;
}

type comparePasswordFunction = (password: string) => boolean | null;
type findByEmail = (email: string) => object | null;
