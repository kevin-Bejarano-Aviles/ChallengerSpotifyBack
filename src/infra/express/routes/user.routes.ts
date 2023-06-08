import { Request, Response, Router } from "express";
import passport from "passport";
import { logger } from '../../logger';
import { addTrack, getAllTrackOfUser, userProfile, userTopTracks } from '../../../controllers/user.controller';
import { UserReq } from "../../../interfaces/UserReq";



const userRouter = Router();


userRouter.get('/auth/spotify',passport.authenticate('spotify',{
    scope: ['user-top-read','user-read-email', 'user-read-private'],
})
);

userRouter.get('/auth/spotify/callback',passport.authenticate('spotify',{
    failureRedirect:'/api/home'
}),function(req:Request,res:Response){
    const user = req.user as UserReq
    
    res.status(200).json({
        // session:req.session,
        user:{
            id:user.id,
            userName: user.userName
        },
        msg:'created/found and logged in'
    })
});


userRouter.get('/logout',(req,res)=>{
    // req.session.destroy(logger.error)
    req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar la sesión:', err);
          res.sendStatus(500);
        } else {
          res.clearCookie('cookie-spotify');
          res.redirect('/api/home')
        }
      });


});

userRouter.get('/:id',userProfile);

userRouter.get('/:id/favorite_songs',userTopTracks)
userRouter.post('/:id/favorite_song',addTrack)

userRouter.get('/:id/tracks',getAllTrackOfUser);
export default userRouter;


