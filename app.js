const Hapi = require("@hapi/hapi")
const http = require("http");
const dotenv = require('dotenv').config();

const init = async () => {
    const routes = require("./routes");
    // let server = http.createServer(routes);
    

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST
    });

    server.route({
        method: "GET",
        path: "/",
        handler: (request, h) => {
            return h.response(`<h1 align="center">Welcome to Webserver(Tutorial by Dicoding) on ${server.info.uri}</h1>`).code(201)
        }
    });

    await server.start();
    console.log(`Server has run at ${server.info.uri}`)
}

init();