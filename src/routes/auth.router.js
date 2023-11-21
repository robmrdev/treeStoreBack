import { Router } from "express";
import passport from "passport";
import { getUser, login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', register)

router.post('/login', login)

router.get('/user', passport.authenticate('current', { session: false }), getUser)



export default router