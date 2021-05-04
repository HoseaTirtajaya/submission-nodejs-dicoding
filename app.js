const Hapi = require("@hapi/hapi");
const { Console } = require("console");
const http = require("http");
const dotenv = require('dotenv').config();

const booksController = require("./controllers/booksController");

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

    server.route({
        method: "POST",
        path: "/books",
        handler: (request, h) => {
            let Books = booksController.createBooks(request, h);
            // console.log(Books)
            return h.response({Books})
        }
    });

    server.route({
        method: "GET",
        path: "/books",
        handler: (request, h) => {
            let Books = booksController.getBooks(request, h);
            return h.response({message: "ah"});
        }
    });

    await server.start();
    console.log(`Server has run at ${server.info.uri}`)
}

init();