const {nanoid} = require("nanoid");
const Books = require("../models/Books");

class booksController{
    static createBooks(request, h){
        let { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        let finished = pageCount === readPage ? true : false;

        Books.push({id: nanoid(), name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt: new Date().toISOString(), updatedAt: new Date().toISOString()});
        return Books;
    }

    static getBooks(request, h){
        console.log("masuk")
    }
}

module.exports = booksController;