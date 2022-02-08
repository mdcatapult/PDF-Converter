const http = require("http");
const request = require("request-promise-native");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 8000;
const pdf2base64 = require("pdf-to-base64");

const outputFilename = `${process.cwd()}/downloaded_pdf.pdf`;

app.use(express.static("src"));
// ejs is a tool that enables us to send variables to an index.html file via res.render
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

app.get("/html", (req, res) => {
  //split on '=' so we only retrieve the PDF URL from the full URL path
  const pdfURl = req.url.split("=")[1];

  if (!pdfURl.endsWith(".pdf")) {
    res.writeHead(400);
    res.end("error: invalid PDF format");
    return;
  }

  downloadPDF(pdfURl, outputFilename)
    .then(() => {
      pdf2base64(outputFilename).then((response) => {
        // This line will pass the pdfBase64Encoded value (response) to the index.html file. We access this variable
        // from the index.html with this value <%= pdfBase64Encoded %>
        res.render("index.html", { pdfBase64Encoded: response });
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
