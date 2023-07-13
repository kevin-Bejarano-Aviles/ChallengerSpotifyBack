import { Router } from "express";
import {
    addTrackToDb,
    spotifyTopTracks,
    userProfile,
    allTracksOfDb,
    searchSongOnDb,
    deleteSongOnDb,
    allUsers,
    findOneSong
} from '../../../controllers/user.controller';
import { isAuthentticated } from '../../../middleware/isAuthenticated';

const userRouter = Router();


userRouter.get('/',isAuthentticated,allUsers)
userRouter.get('/:id', isAuthentticated,userProfile);

userRouter.get('/:id/spotify/favorite_songs',isAuthentticated,spotifyTopTracks);
userRouter.get('/:id/search',isAuthentticated,searchSongOnDb);
userRouter.post('/:id/favorite_songs',isAuthentticated,addTrackToDb);
userRouter.get('/:id/favorite_songs',isAuthentticated,allTracksOfDb);
userRouter.delete('/:idUser/favorite_songs/:idTrack',isAuthentticated,deleteSongOnDb);
userRouter.get('/:idUser/favorite_songs/:idSong',findOneSong)
export default userRouter;


