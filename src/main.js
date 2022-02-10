// Loaded via <script> tag, create shortcut to access PDF.js exports.
const pdfjsLib = window["pdfjs-dist/build/pdf"];

const pdfValue = document.getElementById("pdf-base_64_encoded-value");
// We convert the base64 encoded pdf into bytes which we will pass into the getDocument method
const pdfBase64ToBinary = atob(pdfValue.innerText);

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//mozilla.github.io/pdf.js/build/pdf.worker.js";

let pdfDoc = null,
  scale = 1;

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num, canvas, textLayer) {
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function (page) {
    const viewport = page.getViewport({ scale: scale });
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    const renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise
      .then(function () {
        // Returns a promise, on resolving it will return text contents of the page
        return page.getTextContent();
      })
      .then(function (textContent) {
        // Assign CSS to the textLayer element
        textLayer.style.left = canvas.offsetLeft + "px";
        textLayer.style.top = canvas.offsetTop + "px";
        textLayer.style.height = canvas.offsetHeight + "px";
        textLayer.style.width = canvas.offsetWidth + "px";
        textLayer.style.overflow = "visible";

        // Pass the data to the method for rendering of text over the pdf canvas.
        pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: textLayer,
          viewport: viewport,
          textDivs: [],
        });

        textLayer.style.left = "0px";
        textLayer.style.margin = "2px auto";
      });
  });
}

/**
 * Asynchronously downloads PDF and then renders each page in a separate canvas
 * with a selectable textLayer on top.
 */
pdfjsLib // getDocument data parameter requires a PDF in binary format, this is why we first initially base64 encode it then
  //convert it to binary data via the atob() method above, See https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html
  .getDocument({ data: pdfBase64ToBinary })
  .promise.then(function (pdfDoc_) {
    // Remove the PDF binary value from the DOM now that we have it, If we try to run NER on the page it will try and run through
    // this value when it doesn't need to.
    pdfValue.remove();
    pdfDoc = pdfDoc_;
    const viewer = document.getElementById("pdf-viewer");

    for (let page = 1; page <= pdfDoc_.numPages; page++) {
      const canvas = document.createElement("canvas");
      canvas.className = "pdf-page-canvas";
      viewer.appendChild(canvas);

      const textLayer = document.createElement("div");
      textLayer.classList.add("textLayer");
      canvas.parentNode.insertBefore(textLayer, canvas.nextSibling);

      renderPage(page, canvas, textLayer);
    }
  });
