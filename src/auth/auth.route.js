import { Router } from "express";
import jwt from "jsonwebtoken"
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const CLIENT_HOME_URL = "http://localhost:5173/login"

const authRouter = ({ provider, adapter, jwtToken }) => {

    const AuthRouter = Router()

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
        secretOrKey: jwtToken.accessToken,
    }, async (jwt_payload, done) => {
        console.log("jwt verify")
        await adapter.find(jwt_payload.data) ? done(null, jwt_payload.data) : done(null, false)
    }))

    if (provider.GOOGLE) {
        passport.use(new GoogleStrategy({
            ...provider.GOOGLE,
            callbackURL: "/api/auth/google/callback",
            scope: ['profile']
        }, (accessToken, refreshToken, profile, done) => {
            console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
            return done(null, profile)
        }))

        // AuthRouter.get('/', (req, res) => res.end("auth"))
        // AuthRouter.get('/login', (req, res) => res.end("auth/login"))
        AuthRouter.get('/login/google', passport.authenticate('google', {
            scope: ['profile', "email"]
        }))

        AuthRouter.get('/google/callback', passport.authenticate('google', {
            session: false,
        }), async (req, res) => {
            const user = {
                displayName: req.user.displayName,
                email: req.user._json.email,
                provider: req.user.provider
            }
            const [createdUser] = await adapter.findOrCreate(user)
            const accessToken = jwt.sign({
                data: createdUser,
            }, jwtToken.accessToken, { expiresIn: "15s" })

            const refreshToken = jwt.sign({
                data: createdUser,
            }, jwtToken.refreshToken, { expiresIn: "7d" })

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.redirect(`${CLIENT_HOME_URL}?callback=true`)
        })
    }

    passport.serializeUser(function (user, done) {
        done(null, user)
    })

    passport.deserializeUser(function (obj, done) {
        done(null, obj)
    })

    AuthRouter.get('/refresh', (req, res) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
        const refreshToken = cookies.jwt;
        jwt.verify(
            refreshToken,
            jwtToken.refreshToken,
            async (err, decoded) => {
                if (err) return res.status(403).json({ message: "Forbidden" });

                const foundUser = await adapter.find(decoded.data)

                if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

                const accessToken = jwt.sign(
                    {
                        data: decoded.data
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15m" }
                );

                res.json({ accessToken, user: decoded.data.displayName });
            }
        );
    })
    AuthRouter.get('/logout', function (req, res, next) {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        res.json({
            message: "Logout Successfully"
        })
    });

    return AuthRouter
}

export default {
    authRouter,
    authenticate: () => async (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.user = decoded.data
            next();
        });
    },
    initialise: () => passport.initialize()
}