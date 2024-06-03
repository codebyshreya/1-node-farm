const http = require("http");
const url = require("url");
const fs = require("fs");
function productView(productCard, product) {
  let output = productCard.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
}
const allproductTemplate = fs.readFileSync("./templates/overview.html", "utf-8");
const productDetailTemplate = fs.readFileSync("./templates/product.html", "utf-8");
const productCard = fs.readFileSync("./templates/productCard.html", "utf-8");
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const products = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // product overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const productDisplay = products.map((item) => productView(productCard, item)).join("");
    const output = allproductTemplate.replace("{%PRODUCT_CARDS%}", productDisplay);
    res.end(output);
  }

  // product details
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const productItem = products[query.id];
    const output = productView(productDetailTemplate, productItem);
    res.end(output);
  }

  // api
  else if (pathname === "/api") {
    res.end(data);
  }

  // 404
  else {
    res.writeHead(404, {
      "content-head": "text/html",
    });
    res.end("this is not home");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("hello from server");
});
