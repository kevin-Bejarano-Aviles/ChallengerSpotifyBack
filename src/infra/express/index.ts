import express from 'express';
import config from '../../config/express'
import routes from './routes'
import { iServer } from '../iServer'
import { logger } from '../logger';
import passport from 'passport';
import passportSpotify, { Profile } from 'passport-spotify';
import path from 'path';
import session from 'express-session';
import { createUser,findOneUser } from '../../methods/user.methods';

const SpotifyStrategy = passportSpotify.Strategy;
interface CustomProfile extends Profile{
    accessToken: string
}

class ExpressServer implements iServer {
    constructor(private appServer=express()) {}
    
    start() {
        passport.serializeUser(function(user,done){
            
            done(null,user)//esto es lo que se guarda en la session
            //hacer que solo se ponga el id y el...¿token?
        });
        passport.deserializeUser(function(user:any,done){//y esto es req.user 
            done(null,user)
            //buscar en la bd y traer el objeto nada mas
        });

        passport.use(
            new SpotifyStrategy(
                {
                    clientID:config.clientId,
                    clientSecret:config.clientSecret,
                    callbackURL:config.callBackURL,
                    
                },
                async function(accessToken, refreshToken, expires_in, profile:Profile, done){
                    // expires_in = 3600;
                    const customProfile = profile as CustomProfile;
                    customProfile.accessToken = accessToken;
                    
                    const user = await findOneUser(customProfile.id);

                    if(!user){
                        await createUser(customProfile.id,customProfile.displayName,customProfile._json.email)
                    }

                    const newProfile = {
                        id:customProfile.id,
                        userName: customProfile.displayName,
                        accessToken: customProfile.accessToken
                    }

                    return done(null,newProfile)
                }
        ));
        
        this.appServer.set('views', path.join(__dirname,'..','..', 'views'));
        this.appServer.set('view engine','ejs');
        this.appServer.use(express.static(path.join(__dirname,'..','..','public')));
        // 

        this.appServer.use(session(
            {
                secret:'gatoperro',
                resave:false,
                saveUninitialized:false,
                cookie:{
                    secure: false,
                    maxAge: 360000,
                },
                name:'cookie-spotify'
            }
        ));
        this.appServer.use(passport.initialize());
        this.appServer.use(passport.session());
        // 
        this.appServer.use(express.urlencoded({ extended: true }));
        this.appServer.use(express.json())
        this.appServer.use('/api', routes);

        const port = config.port;
  
        this.appServer.listen(port, ()=>{
            logger.info(`SERVER UP running in http://localhost:${port}`)
        })
    }
}

export default new ExpressServer();