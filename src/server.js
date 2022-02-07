const http = require("http");
const request = require("request-promise-native");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 8000;
const pdf2base64 = require("pdf-to-base64");
const bodyParser = require("body-parser");

const outputFilename = `${process.cwd()}/test_download.pdf`;

app.use(express.static("src"));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

app.get("/download-pdf", (req, res) => {
  pdf2base64(outputFilename)
    .then((response) => {
      // console.log(response); //cGF0aC90by9maWxlLmpwZw==
      res.render("index.html", { pdfBase64Encoded: response });
    })
    .catch((error) => {
      console.log(error); //Exepection error....
    });
});

app.get("/", function (req, res) {
  // res.render('index.html',{email:data.email,password:data.password});
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});

async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });
  fs.writeFileSync(outputFilename, pdfBuffer);
}
