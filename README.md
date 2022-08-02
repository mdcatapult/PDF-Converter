# PDF Converter Web Service

Loads a PDF over the web which then converts it into HTML.

## How to start

To start the application locally you can run `npm run start` which will start a server on `localhost:8000`, Then you will need to pass it the URL of a PDF which you want to convert.

## Endpoints

Endpoint `get` `/html` followed by a query parameter `?url=` which points to
the location of the pdf. For example, if I wanted to convert this PDF http://www.africau.edu/images/default/sample.pdf to a HTML format,
I would type this into my browser: `http://localhost:8000/html?url=http://www.africau.edu/images/default/sample.pdf`
Response type `text/html`

## Running prettier for formatting

`npx prettier --write .`

### License

This project is licensed under the terms of the Apache 2 license, which can be found in the repository as `LICENSE.txt`
