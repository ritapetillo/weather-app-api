import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../../../types/User";

interface User {
  _id: string;
  email: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export function encodeJWT(
  payload: string | object | Buffer,
  secret: string,
  expiration: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: expiration }, (err, token) => {
      if (err) return reject(err);
      else return resolve(token);
    });
  });
}

export function decodeJWT(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      else return resolve(decoded);
    });
  });
}

export const generateTokens = async (user: IUser): Promise<Tokens> => {
  try {
    const accessToken = await encodeJWT(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      "1hr"
    );
    const refreshToken = await encodeJWT(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET!,
      "1d"
    );
    const tokens: Tokens = { accessToken, refreshToken };
    return tokens;
  } catch (err) {
    return err;
  }
};

export const generateCookies = async (tokens: Tokens, res: Response) => {
  try {
    const { accessToken, refreshToken } = tokens;
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
  } catch (err) {
    return null;
  }
};

export const clearCookies = async (res: Response) => {
  try {
    res.cookie("accessToken", "", { expires: new Date(0) });
    res.cookie("refreshToken", "", { expires: new Date(0) });
    console.log("clear cookies");
  } catch (err) {
    return null;
  }
};
