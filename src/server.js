/*
 * Copyright 2022 Medicines Discovery Catapult
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const http = require("http");
const request = require("request-promise-native");
const fs = require("fs");
const express = require("express");
require("dotenv").config();
const pdf2base64 = require("pdf-to-base64");

const app = express();
const port = process.env.PORT;
const outputFilename = `${process.cwd()}/downloaded_pdf.pdf`;

app.use(express.static("src"));
// ejs is a tool that enables us to send variables to an index.html file via res.render
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

app.get("/html", (req, res) => {
  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  // extract the PDF URL from the request URL
  const pdfURL = new URL(url).searchParams.get("url");

  if (!pdfURL.endsWith(".pdf")) {
    res.writeHead(400);
    res.end("error: invalid PDF format");
    return;
  }

  downloadPDF(pdfURL, outputFilename)
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
