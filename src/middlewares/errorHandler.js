import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
    if (err?.code === 400) {
        res.status(400).json({ message: err.message })
        return
    }
    if (err?.code === 401) {
        res.status(401).json({ message: err.message ?? "Unauthorized request" })
        return
    }
    if (err?.code === 403) {
        res.status(403).json({ message: "Forbiden" })
        return
    }
    if (err?.code === 500) {
        res.status(500).json({ message: err.message })
        return
    }

    logEvents(
        `${err.name}:${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        "errLog.log"
    );
    console.log(err.stack);
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status);
    res.json({ message: err.message, isError: true });
};

const notFound = (req, res) => {
    res.status(404);
    if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("text").send("404 Not Found");
    }
}

export default (app) => {
    app.all("*", notFound)
    app.use(errorHandler)
}

