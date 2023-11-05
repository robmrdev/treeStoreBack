import passport from 'passport'
import jwt from 'passport-jwt'
import local from 'passport-local'
import { PRIVATE_KEY_JWT } from './constants.js';


const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY_JWT
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }))

    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    });

}

const cookieExtractor = req =>{
    let token = null
    if(req && req.cookies){
        token = req.cookies['accessTokenCookie']
    }
    return token
}

export default initializePassport