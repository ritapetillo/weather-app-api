import { error } from "console";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
const userRouter = express.Router();
import User from "../../Models/User";
import { auth, authenticate, RequestWithUser } from "../middlewares/auth";
import { generateCookies, generateTokens, Tokens } from "../../LIb/Auth/Utils";
import passport from "passport";

// userRouter.post("/login", authenticate, async (req: any, res, next) => {
//   console.log(req.user);
//   res.send("logged");
// });
userRouter.get("/", async (req: any, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

//GET CURRENT USER
//ROUTE /users/me
userRouter.get("/me", auth, async (req: any, res, next) => {
  try {
    const user = req.user;
    if (!user) throw error;
    res.status(201).send({ user });
  } catch (err) {
    console.log(err);
  }
});

//POST LOG USER IN
//ROUTE /users/login
userRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) throw error;
      const isValid = user.comparePassword(password);
      console.log(isValid);
      if (!isValid) throw error;
      const tokens: Tokens = await generateTokens(user);
      const cookies = await generateCookies(tokens, res);
      res.status(201).send({ tokens });
    } catch (err) {
      res.send(401).send("Wrong Credentials");
    }
  }
);

//REGISTER USER
//ROUTE /users/register
userRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      res.send({ user: savedUser });
    } catch (err) {
      res.send(401).send("Wrong Credentials");
    }
  }
);

//EDIT USER
//ROUTE /users/register
userRouter.put(
  "/edit/:emailUser",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { email } = req.user;
      const user = await User.findOneAndUpdate({ email }, req.body);
      console.log(user);
      res.status(201).send({ user });
    } catch (err) {
      console.log(err);
      res.send(401).send("Wrong Credentials");
    }
  }
);
//EDIT PASS
//ROUTE /users/register
userRouter.put(
  "/password/:emailUser",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { emailUser } = req.params;
      const user = await User.findOne({ email: emailUser });
      if (user) {
        user.password = req.body.password;
        user.save();
        res.status(201).send({ user });
      } else {
        throw error;
      }
    } catch (err) {
      console.log(err);
      res.send(401).send("Wrong Credentials");
    }
  }
);

//EDIT USER
//ROUTE /users/register
userRouter.put(
  "/addcity/:city",
  auth,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { email } = req.user;
      const user = await User.findOneAndUpdate(
        { email },
        { $addToSet: { favoriteCities: req.params.city } }
      );

      res.status(201).send({ user });
    } catch (err) {
      console.log(err);
      res.send(401).send("Wrong Credentials");
    }
  }
);

//LOGIN GOOGLE
userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log(req.user);
      const { tokens } = req.user;
      const cookies = await generateCookies(tokens, res);
      //verify credentials
      res.redirect("http://localhost:3000");
    } catch (err) {
      next(err);
    }
  }
);

// //REFRESH TOKEN
// //ROUTE /users/register
// userRouter.put(
//   "/edit/:emailUser",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { emailUser } = req.params;
//       const user = await User.findOneAndUpdate({ email: emailUser }, req.body);
//       console.log(user);
//       res.status(201).send({ user });
//     } catch (err) {
//       console.log(err);
//       res.send(401).send("Wrong Credentials");
//     }
//   }
// );

export default userRouter;
