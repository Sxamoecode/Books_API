const fs = require('fs');

exports.CreateBook = (req, res) => {
    let data = ''
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        data = JSON.parse(data);
        const Book = {
            title: data.title,
            author: data.author,
            dateCreated: new Date()
        }
        if (!Book.title || !Book.author) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Insert Valid details'
            }))
        }
        fs.readFile('model/Books.json', 'utf8', (err, book) => {
            if(err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                console.log(err);
                return res.end(JSON.stringify({
                    message: 'Server error'
                }))
            }
            parseBook = JSON.parse(book.toString())
            parseBook.push(Book)
            fs.writeFile('model/Books.json', JSON.stringify(parseBook), err => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({
                        message: 'Book Not Created',
                    }))
                }
                res.writeHead(201, {'Content-Type': 'application/json'});
                console.log(Book)
                return res.end(JSON.stringify({
                    message: 'Book Created',
                    Book
                }));
            })
        })
    })

}

exports.getAllBooks = (req, res) => {
    fs.readFile('model/Books.json', 'utf8', (err, book) => {
        if(err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            console.log(err);
            return res.end(JSON.stringify({
                message: 'Server error'
            }))
        }
        console.log(book.toString());
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({
            message: 'Books Retrieval Success',
            books: JSON.parse(book.toString())
        }))
    })
}

exports.getBook = (req, res, query) => {
    bookTitle = query.toString().split('&')[0].split('=')[1].replace('+', ' ')
    author = query.toString().split('&')[1].split('=')[1]
    if (!bookTitle && author) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({
            message: 'Please insert valid details'
        }))
    }
    fs.readFile('model/Books.json', 'utf8', (err, book) => {
        if(err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            console.log(err);
            return res.end(JSON.stringify({
                message: 'Server error'
            }))
        }
        parseBook = JSON.parse(book.toString())
        findBook = parseBook.find(Book => Book.title === bookTitle && Book.author === author)
        console.log(findBook);
        if (!findBook) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({
                message: 'Book not found'
            }))
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({
            message: 'Book retrieval successful',
            book: findBook
        }))
    });
}

exports.editBook = (req, res, query) => {}

exports.deleteBook = (req, res, query) => {
    bookTitle = query.toString().split('&')[0].split('=')[1].replace('+', ' ');
    author = query.toString().split('&')[1].split('=')[1];

    if (!bookTitle) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({
            message: 'Book Title and Author required'
        }))
    }

    fs.readFile('model/Books.json', 'utf8', (err, book) => {
        if(err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            console.log(err);
            return res.end(JSON.stringify({
                message: 'Couldn\'t read database'
            }))
        }
        parseBook = JSON.parse(book.toString())
        if (!parseBook) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({
                message: 'Book not found, pls'
            }))
        }
        const findBook = parseBook.find(Book => Book.title === bookTitle && Book.author === author)
        console.log(findBook);
        if (!findBook) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({
                message: 'Book not found'
            }))
        }

        const delBook = parseBook.filter(Book => Book.title !== bookTitle || Book.author !== author);
        console.log(delBook);
        fs.writeFile('model/Books.json', JSON.stringify(delBook), err => {
            if (err) {
                console.log(err);
                res.writeHead(500, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({
                    message: 'Internal Server error',
                }));
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({
                message: 'Book Deletion successful'
            }));
        });
    });
};
