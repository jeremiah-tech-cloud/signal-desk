const http = require("http");
const fs = require("fs");
const path = require("path");

// Reuse the MongoDB details from the bot's .env
process.loadEnvFile(path.join(__dirname, "..", "bot", ".env"));

const handler = require("./api/data.js");

http.createServer((req, res) => {
  if (req.url.startsWith("/api/data")) {
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (obj) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(obj));
    };
    return handler(req, res);
  }
  fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
    if (err) { res.statusCode = 500; return res.end("index.html not found"); }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(data);
  });
}).listen(3000, () => console.log("Dashboard running at http://localhost:3000"));