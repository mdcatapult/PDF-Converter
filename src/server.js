const http = require("http");
const request = require("request-promise-native");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 8000;
const pdf2base64 = require("pdf-to-base64");
const bodyParser = require("body-parser");

const outputFilename = `${process.cwd()}/downloaded_pdf.pdf`;

app.use(express.static("src"));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

app.get("/download-pdf", (req, res) => {
  const path = req.url.split("=")[1];

  if (!path.endsWith(".pdf")) {
    res.writeHead(500);
    res.end("error: invalid PDF format");
    return;
  }

  downloadPDF(path, outputFilename)
    .then(() => {
      pdf2base64(outputFilename)
        .then((response) => {
          res.render("index.html", { pdfBase64Encoded: response });
        })
        .catch((error) => {
          res.writeHead(500);
          res.end(error);
        });
    })
    .catch((error) => {
      res.writeHead(500);
      res.end(error);
    });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });
  fs.writeFileSync(outputFilename, pdfBuffer);
}
