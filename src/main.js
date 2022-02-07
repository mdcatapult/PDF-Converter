// If absolute URL from the remote server is provided, configure the CORS
// header on that server.

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window["pdfjs-dist/build/pdf"];

const pdfValue = document.getElementById("pdf-value");

var pdfData = atob(pdfValue.innerText);
// console.log('pdf value content', pdfValue.innerText)

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//mozilla.github.io/pdf.js/build/pdf.worker.js";

var pdfDoc = null,
  pageRendering = false,
  pageNumPending = null,
  scale = 1;

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num, canvas, textLayer) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function (page) {
    var viewport = page.getViewport({ scale: scale });
    var ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise
      .then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      })
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
pdfjsLib.getDocument({ data: pdfData }).promise.then(function (pdfDoc_) {
  pdfDoc = pdfDoc_;
  var viewer = document.getElementById("pdf-viewer");

  for (let page = 1; page <= pdfDoc_.numPages; page++) {
    var canvas = document.createElement("canvas");
    canvas.className = "pdf-page-canvas";
    viewer.appendChild(canvas);

    var textLayer = document.createElement("div");
    textLayer.classList.add("textLayer");
    canvas.parentNode.insertBefore(textLayer, canvas.nextSibling);

    renderPage(page, canvas, textLayer);
  }
});
