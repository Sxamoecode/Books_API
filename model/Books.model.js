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
            parseAccount = JSON.parse(book.toString())
            parseAccount.push(Book)
            fs.writeFile('model/Books.json', JSON.stringify(parseAccount), err => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({
                        message: 'Book Not Created',
                    }))
                }
                res.writeHead(500, {'Content-Type': 'application/json'});
                console.log(Book)
                return res.end(JSON.stringify({
                    message: 'Book Created',
                    Book
                }));
            })
        })
    })

}
