import { Router } from "express";
import passport from "passport";
import toAsyncRouter from "async-express-decorator";
import { getUser, login, register } from "../controllers/auth.controller.js";

const router = toAsyncRouter(Router());

router.post('/register', register)

router.post('/login', login)

router.get('/user', passport.authenticate('current', { session: false }), getUser)



export default router