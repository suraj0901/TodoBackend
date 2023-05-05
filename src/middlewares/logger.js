import { format } from 'date-fns'
import { existsSync } from 'fs'
import { v4 as uuid } from 'uuid'
import * as fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!existsSync(join(__dirname, '..', 'logs'))) {
            await fs.promises.mkdir(join(__dirname, '..', 'logs'))
        }
        await fs.promises.appendFile(join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path} ${req.headers.origin}`)
    next()
}
