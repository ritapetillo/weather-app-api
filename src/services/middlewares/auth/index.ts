import { error } from "console";
import { errorMonitor } from "events";
import { NextFunction, Request, Response } from "express";
import firebase from "../../../LIb/Auth/firebase";
import { decodeJWT } from "../../../LIb/Auth/Utils";
import User from "../../../Models/User";
//create google provider
export interface RequestWithUser extends Request {
  user: Object;
}
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const profile = req.body.data;
  try {
    const user = await User.findOne({ email: profile.email });
    if (!user) {
      const newUser = new User({
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        google_id: profile.id,
      });
      const savedUser = await newUser.save();
      //@ts-ignore
      req.user = savedUser;
      next();
    } else {
      //@ts-ignore
      req.user = user;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log("here", req.cookies);
    console.log(req.cookies);

    const { accessToken } = req.cookies;
    if (!accessToken) throw error;
    const decoded = await decodeJWT(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    );

    const user = await User.findById(decoded.id);
    console.log(user);
    if (!user) throw error;
    req.user = user;

    next();
  } catch (err) {
    const error = new Error("Credentials are not correct");
    //@ts-ignore
    error.code = 401;
    next(error);
  }
};
