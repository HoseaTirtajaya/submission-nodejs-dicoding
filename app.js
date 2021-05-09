const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const dotenv = require('dotenv').config() 

const booksController = require("./controllers/booksController");

//-------------------https://github.com/HoseaTirtajaya/submission-nodejs-dicoding----------------------//

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
                headers: ["Accept", "Content-Type"],
                additionalHeaders: ["X-Requested-With"]
            }
        }
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
                options: {
                    abortEarly: false
                },
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

                failAction: (request, h, err) => {
                    return h.response({status: "fail", message: err.message}).code(400).takeover();
                }
            },
        },

        handler: (request, h) => {
            let Books = booksController.createBooks(request, h);
            if(typeof(Books) === "string"){
                return h.response({status: "fail", message: Books}).code(400);
            } else if(typeof(Books) === "object"){
                return h.response({Books}).code(201);
            } else {
                return h.response({Books}).code(500)
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
                options:{
                    abortEarly: false
                },
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
                failAction: (request, h, err) => {
                    return h.response({status: "fail", message: err.message}).code(400).takeover();
                }
            },
        },
        handler: (request, h) => {
            let Books = booksController.updateBook(request, h);

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
        method: "GET",
        path: "/books/{bookId}",
        handler: (request, h) => {
            let Books = booksController.getSpecificBook(request, h);
            if(Books.message === "Buku tidak ditemukan"){
                return h.response(Books).code(404)
            } else {
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