import { Router } from "express";


const homeRouter = Router();


// homeRouter.post('/auth/spotify',);
homeRouter.get('/', (req, res) => {
    res.render('home')
})


export default homeRouter;