import { kStringMaxLength } from "buffer";
import mongoose from "mongoose";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    google_id: {
      type: String,
    },
    defaultCity: {
      type: String,
    },
    favoriteCities: {
      type: Array,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  //if pasword is not modified, ignore the following code
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    const error = new Error("There was an error saving the credentials");
    next(error);
  }
});
//@ts-ignore
userSchema.pre<IUser>("findOnedAndUpdate", async function (next) {
  console.log(this.password);
  const salt = await bcrypt.genSalt();
  //@ts-ignore
  this._update.password = await bcrypt.hash(this._update.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  try {
    const pass: any = this.password;
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (err) {
    return null;
  }
};

export default mongoose.model<IUser>("userdb", userSchema);
