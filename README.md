# PDF.js service

Loads a PDF over the web which then converts it into HTML and renders it in the browser with a text overlay which can then be NER'd by a service such as Aurac. 

## How to start
To start the application locally you can run `npm run start` which will start a server on `localhost:8000`, Then you will need to pass it the URL of a PDF which you want to convert. 

## Endpoints

The PDF-js converter service which is deployed on wopr as `https://pdf-js.wopr.inf.mdc` takes a sub domain path of   `/download-pdf` followed by a query parameter `/?url=` which points to
the location of the pdf. For example, if I wanted to convert this PDF http://www.africau.edu/images/default/sample.pdf to a HTML format, 
I would type this into my browser: `https://pdf-js.wopr.inf.mdc/download-pdf/?url=http://www.africau.edu/images/default/sample.pdf`

### Running locally

Once you have run `npm run start` to spin up the application, To convert a PDF you would follow the same steps as shown above except rather than using https://pdf-js.wopr.inf.mdc 
you would instead use `localhost:8000`
