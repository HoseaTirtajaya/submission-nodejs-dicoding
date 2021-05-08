const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const dotenv = require('dotenv').config() 

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
        config: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    year: Joi.number().required(),
                    author: Joi.string().required(),
                    summary: Joi.string().required(),
                    publisher: Joi.string().required(),
                    pageCount: Joi.number().required(),
                    readPage: Joi.number().required(),
                    reading: Joi.boolean().required()
                }),
                
            },

            handler: (request, h) => {
                let Books = booksController.createBooks(request, h);
                // console.log(Books)
                if(typeof(Books) === "string"){
                    return h.response({status: "fail", message: Books}).code(400);
                } else if(typeof(Books) === "object"){
                    return h.response({Books}).code(201);
                } else {
                    return h.response({Books}).code(500)
                }
            }
        }
    });

    server.route({
        method: "GET",
        path: "/books",
        handler: (request, h) => {
            let Books = booksController.getBooks(request, h);
            return h.response(Books).code(201);
        }
    });

    server.route({
        method: "PUT",
        path: "/books/{bookId}",
        config: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    year: Joi.number().required(),
                    author: Joi.string().required(),
                    summary: Joi.string().required(),
                    publisher: Joi.string().required(),
                    pageCount: Joi.number().required(),
                    readPage: Joi.number().required(),
                    reading: Joi.boolean().required()
                }),
                
            },
        },
        handler: (request, h) => {
            let Books = booksController.getSpecificBooks(request, h);

            if(Books.message === "Gagal memperbaharui buku. Buku tidak ditemukan"){
                return h.response(Books).code(404)
            } else if(Books.message === "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"){
                return h.response(Books).code(400)
            } else if(Books){
                return h.response(Books).code(200)
            }
        }
    });

    server.route({
        method: "DELETE",
        path: "/books/{bookId}",
        handler: (request, h) => {
            let Books = booksController.deleteBook(request, h);

            if(Books.message === "Buku gagal dihapus. Id tidak ditemukan"){
                return h.response(Books).code(404)
            } else {
                return h.response(Books).code(200)
            }
        }
    });

    await server.start();
    console.log(`Server has run at ${server.info.uri}`)
}

init();