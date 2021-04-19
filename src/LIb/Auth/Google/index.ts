import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../../Models/User";
import { IUser } from "../../../types/User";
import { generateTokens } from "../Utils";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      callbackURL:
        "https://weatherapp-api-portfolio.herokuapp.com/api/users/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        const { email, given_name, family_name, picture } = profile._json;
        //verify if the user is already registered
        const user = await User.findOne({ email });
        if (!user) {
          //register the user
          const newUser: IUser = new User({
            firstName: given_name,
            lastName: family_name,
            // picture:picture,
            email,
            google_id: profile.id,
          });
          const savedUser: IUser = await newUser.save();
          const tokens = await generateTokens(savedUser);
          done(undefined, { user: savedUser, tokens });
        } else {
          //generate token
          const tokens = await generateTokens(user);
          console.log(tokens);
          done(undefined, { user, tokens });
        }
      } catch (err) {
        console.log(err);
        done(err, undefined);
      }

      console.log(profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
