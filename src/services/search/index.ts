import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
const searchRouter = express.Router();
import axios from "axios";

searchRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      const results = await axios.get(
        `${process.env.WEATHER_APP_API_URL}?q=${q}&appid=${process.env.WEATHER_APP_API_KEY}`
      );
      const data = await results.data;
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
);
searchRouter.get(
  "/full",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lon } = req.query;
      const results = await axios.get(
        `${process.env.WEATHER_APP_API_URI}lat=${lat}&lon=${lon}&&units=metric&appid=${process.env.WEATHER_APP_API_KEY}`
      );
      const data = await results.data;
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
);

export default searchRouter;
