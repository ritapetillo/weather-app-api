import express from "express";
import userRoutes from './users'
import searchRoutes from './search'
const apiRouter = express.Router();



apiRouter.use('/users', userRoutes)
apiRouter.use("/search", searchRoutes);


export default apiRouter;
