const http = require('http')
const {CreateBook, getAllBooks, getBook} = require('./model/Books.model')
PORT = 5000

const server = http.createServer((req, res) => {
    url = req.url
    headers = req.headers
    parseURL = new URL(url, `http://${headers.host}`)
    pathname = parseURL.pathname
    method = req.method
    query = parseURL.searchParams
    console.log(url, parseURL, pathname, method, query);

    switch (pathname) {
        case '/':
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Home Page'
            }))
            break;
        case '/book':
            switch (method) {
                case 'POST':
                    CreateBook(req, res);
                    break
                case 'GET':
                    getBook(req, res, query);
                    break
            }
            break
        case '/books':
            getAllBooks(req, res);
    
        default:
            break;
    }
})


server.listen(PORT, () => {
    console.log(`Server up and running on https://localhost:${PORT}`);
})
