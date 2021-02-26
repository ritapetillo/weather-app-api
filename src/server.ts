import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import error_handler from "node-error-handler";
import apiRoutes from "./services";
import cookieParser from "cookie-parser";
import passport from "passport";
const server = express();
const PORT = process.env.PORT!;
const whitelist = ["http://localhost:3000"];
import "./LIb/Auth/Google";

//MIDDLEWARES
server.use(express.json());
server.use(passport.initialize());
server.use(
  cors({
    origin: whitelist,
    credentials: true,
  })
);

server.use(cookieParser());
//ROUTES
server.use("/api", apiRoutes);

//ERROR HANDLER
server.use(error_handler({ log: true, debug: true }));

mongoose
  .connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) =>
    server.listen(PORT, () => console.log("server connect to " + PORT))
  );
