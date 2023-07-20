import configEnv from "../../config/express";
import passport from "passport"
import {Strategy} from 'passport-spotify'
import { findByEmailOrCreateUser } from '../../methods/user.methods';


const SpotifyStrategy = Strategy;

export const passportUse =() =>{
    passport.use(
        new SpotifyStrategy(
            {
                clientID:configEnv.clientId,
                clientSecret:configEnv.clientSecret,
                callbackURL:configEnv.callBackURL,
                
            },
            async (accessToken, refreshToken, expires_in, profile, done)=>{
                
                const user = await findByEmailOrCreateUser(profile.displayName,profile._json.email);
                
                
                const customProfile = {
                    id:user.id,
                    userName:user.user_name,
                    accessToken
                }
                
                return done(null,customProfile);//?customProfile guarda lo que se guarda en la session

            }
        )
    )
}