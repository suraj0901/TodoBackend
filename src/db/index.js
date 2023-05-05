import { Sequelize } from "sequelize";
import { logEvents } from "../middlewares/logger.js"

/**
 * @type {Sequelize}
 */
let sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync()
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log(err);
        logEvents(
            `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
            "sequelizeErrorLog.log"
        );
    }
}

export default sequelize