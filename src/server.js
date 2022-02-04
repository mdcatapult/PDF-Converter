const http = require("http");
const request = require("request-promise-native");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 8000;
const pdf2base64 = require('pdf-to-base64');

const outputFilename = `${process.cwd()}/test_download.pdf`;

app.use(express.static('src'))

app.get("/download-pdf", (req, res) => {

    pdf2base64(outputFilename)
            .then(
                (response) => {
                    console.log(response); //cGF0aC90by9maWxlLmpwZw==
                }
            )
            .catch(
                (error) => {
                    console.log(error); //Exepection error....
                }
            )
})


app.get("/", (req, res) => {
    var fileName = "/index.html";
    fs.promises
        .readFile(__dirname + fileName)
        .then((contents) => {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(contents);
        })
        .catch((err) => {
          res.writeHead(500);
          res.end(err);
        });
})

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});

async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });
  fs.writeFileSync(outputFilename, pdfBuffer);
}
