const {nanoid} = require("nanoid");
const Books = require("../models/Books");

class booksController{
    static createBooks(request, h){
        let { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

        if(pageCount >= readPage){
            let finished = pageCount === readPage ? true : false;
            let books_id = nanoid();
    
            Books.push({id: books_id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt: new Date().toISOString(), updatedAt: new Date().toISOString()});

            let response = {status: "success", message: "Buku berhasil ditambahkan", data: {bookId: books_id}}
            return response;
        } else if(pageCount <= readPage){
            return "Gagal menambahkan buku. readPage tidak boleh lebih besar dari total halaman"
        } else {
            let response = {
                status: "error",
                message: "buku gagal ditambahkan"
            }

            return response;
        }
    }

    static getBooks(request, h){
        let books = [];
        let {name, reading, finished} = request.query;

        if(JSON.stringify(request.query) !== '{}'){
            Books.forEach(item => {
                if(item.reading == reading){
                   books.push({
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher  
                    }) 
                } 
                
                if(item.finished == finished){
                    books.push({
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher  
                    })
                }

                if(name !== undefined && name !== null){
                    if(name.toLowerCase() == item.name.toLowerCase())
                    books.push({
                        id: item.id,
                        name: item.name,
                        publisher: item.publisher  
                    })
                }
            })
            let response = {
                status: "success",
                data: {
                    books
                }
            }
            return response;
        } else {
            Books.forEach(item => {
                books.push({
                    id: item.id,
                    name: item.name,
                    publisher: item.publisher  
                })
            });
            let response = {
                status: "success",
                data: {
                    books
                }
            }
            return response;
        }
    }

    static getSpecificBooks(request, h) {
        let {bookId} = request.params;
        let {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
        let found = false;

        for(let i = 0; i < Books.length; i++){
            if(Books[i].id === bookId){
                if(pageCount >= readPage){
                    let finished = pageCount === readPage ? true : false;

                    Books[i].name = name;
                    Books[i].year = year;
                    Books[i].author = author;
                    Books[i].summary = summary;
                    Books[i].publisher = publisher;
                    Books[i].pageCount = pageCount;
                    Books[i].readPage = readPage;
                    Books[i].reading = reading;
                    Books[i].finished = finished;
    
                    let response = {
                        status: "success",
                        message: "Buku berhasil diperbaharui"
                    }
                    
                    found = true;
                    return response;
                } else if(pageCount <= readPage){
                    found == true;
                    let response = {
                        status: "fail",
                        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
                    }
                    
                    return response;
                }
            } 
        }
        if(found === false){
                let response = {
                    status: "fail",
                    message: "Gagal memperbaharui buku. Buku tidak ditemukan"
                }
                
                return response;
        }
    }

    static deleteBook(request, h){
        let {bookId} = request.params;
        let found = false;
        
        for(let j = 0; j < Books.length; j++){
            if(Books[j].id == bookId){
                found = true;
                Books.splice(j, 1);

                let response = {
                    status: "success",
                    message: "Buku berhasil dihapus"
                }

                return response;
            }
        }
        
        if(found === false){
            let response = {
                status: "fail",
                message: "Buku gagal dihapus. Id tidak ditemukan"
            }

            return response;
        }
    }

    }

module.exports = booksController;