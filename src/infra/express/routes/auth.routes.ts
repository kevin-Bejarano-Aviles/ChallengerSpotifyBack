import { Router } from "express";
import passport from "passport";
import { login, logout } from '../../../controllers/auth.controller';
import { isAuthentticated } from '../../../middleware/isAuthenticated';

const authRouter = Router();

authRouter.get('/logged',login)

authRouter.get('/login/spotify',passport.authenticate('spotify',{
    scope: ['user-top-read','user-read-email', 'user-read-private'],
}))

authRouter.get('/login/spotify/callback',passport.authenticate('spotify',{
    // failureFlash:'/api/home',
    successRedirect:'http://localhost:3000'
    // successRedirect:'/api/auth/logged'
}));


authRouter.get('/logout',logout);

export default authRouter;