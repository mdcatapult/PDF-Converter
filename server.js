const http = require("http");
const request = require('request-promise-native');
const fs = require('fs')
const express = require('express')

const app = express();
const host = '0.0.0.0';
const port = 8000;

const outputFilename = `${process.cwd()}/test_download.pdf`
startFileServer(outputFilename)

app.get('/', (req, res) => {
    res.send('Hello World!')

    const path = req.url.split('=')[1]
    downloadPDF(path, outputFilename).then(() => {

        var fileName = "/index.html";
        fs.promises.readFile(__dirname + fileName)
            .then(contents => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(contents);
            })
            .catch(err => {
                res.writeHead(500);
                res.end(err);
            });
    }).catch(e => {
        req.uri ? console.log(e) : console.log('warn: Invalid URI on URL:', req.url)
    })
})

app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
})

function startFileServer(filePath) {
    http.createServer(function (request, response) {

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, {'Content-Type': 'application/pdf'});
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Access-Control-Allow-Origin': '*'
                });

                response.end(content, 'utf-8');
            }
        });

    }).listen(8125);
}

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
    fs.writeFileSync(outputFilename, pdfBuffer);
}
