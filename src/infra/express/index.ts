import express from 'express';
import config from '../../config/express'
import routes from './routes'
import { iServer } from '../iServer'
import { logger } from '../logger';
import passport from 'passport';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import { passportUse } from '../../helpers/passport/possportUse';
import { findOneUser } from '../../methods/user.methods';

class ExpressServer implements iServer {
    constructor(private appServer=express()) {}
    
    start() {
        passport.serializeUser(function(user:any,done){
           return done(null,{
            id:user.id,
            accessToken:user.accessToken})//esto es lo que se guarda en la session
            //hacer que solo se ponga el id y el...¿token?
        });
        passport.deserializeUser ( async(user:any,done)=>{//y esto es req.user 
            
            const userDb =  await findOneUser(user.id);
            // return done(null,userDb)
            return done(null,{
                ...userDb,
                accessToken:user.accessToken
            });


            // done(null,user);
            //buscar en la bd y traer el objeto nada mas
        });

        passportUse()
        
        this.appServer.set('views', path.join(__dirname,'..','..', 'views'));
        this.appServer.set('view engine','ejs');
        this.appServer.use(express.static(path.join(__dirname,'..','..','public')));
        

        this.appServer.use(session(
            {
                secret:'gatoperro',
                resave:true,
                saveUninitialized:false,
                cookie:{
                    secure: false,
                    /* maxAge: 36000, */
                },
                name:'cookie-spotify'
            }
        ));
        this.appServer.use(passport.initialize());
        this.appServer.use(passport.session());
        // 
        this.appServer.use(express.urlencoded({ extended: true }));
        this.appServer.use(cors({
            credentials:true,
            origin:["http://localhost:3000"],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }))
        this.appServer.use(express.json())
        this.appServer.use('/api', routes);

        const port = config.port;
  
        this.appServer.listen(port, ()=>{
            logger.info(`SERVER UP running in http://localhost:${port}`)
        })
    }
}

export default new ExpressServer();