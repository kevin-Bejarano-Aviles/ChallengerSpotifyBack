import { Router } from "express";
import userRouter from "./user.routes";
import homeRouter from "./home.routes";



const router = Router();

router.use('/home',homeRouter)
router.use('/user',userRouter)

export default router;