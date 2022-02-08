// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window["pdfjs-dist/build/pdf"];

const pdfValue = document.getElementById("pdf-base_64_encoded-value");

// We convert the base64 encoded pdf into bytes which we will pass into the getDocument method
let pdfBase64ToBinary = atob(pdfValue.innerText);

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
    let viewport = page.getViewport({ scale: scale });
    let ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    let renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    let renderTask = page.render(renderContext);

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
pdfjsLib // pass in the byte PDF to this method and then display to the user
  .getDocument({ data: pdfBase64ToBinary })
  .promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    let viewer = document.getElementById("pdf-viewer");

    for (let page = 1; page <= pdfDoc_.numPages; page++) {
      let canvas = document.createElement("canvas");
      canvas.className = "pdf-page-canvas";
      viewer.appendChild(canvas);

      let textLayer = document.createElement("div");
      textLayer.classList.add("textLayer");
      canvas.parentNode.insertBefore(textLayer, canvas.nextSibling);

      renderPage(page, canvas, textLayer);
    }
  });
