import { Router } from "express";
import userRouter from "./user.routes";
import homeRouter from "./home.routes";
import authRouter from "./auth.routes";



const router = Router();

router.use('/home',homeRouter)
router.use('/user',userRouter)
router.use('/auth',authRouter);
export default router;