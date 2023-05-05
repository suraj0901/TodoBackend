import { Router } from "express";
import todoRoute from "./todosRoute.js"
import Auth from "../auth/auth.route.js";
import User from "../db/modals/user.model.js";
import sequelizeAdapter from "../auth/sequelizeAdapter.js";

const router = Router()

export default () => {
    const routes = {
        "/users": async (req, res) => {
            const users = await User.findAll()
            res.json(users)
        },
        '/todos': todoRoute,
        '/auth': Auth.authRouter({
            provider: {
                GOOGLE: {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }
            },
            jwtToken: {
                accessToken: process.env.ACCESS_TOKEN_SECRET,
                refreshToken: process.env.REFRESH_TOKEN_SECRET
            },
            adapter: sequelizeAdapter(User)
        })
    }

    for (const route in routes) {
        router.use(route, routes[route])
    }

    return router
}

