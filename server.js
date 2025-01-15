const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    let { method, url } = req;

    // Handling GET requests
    if (method === "GET") {
        if (url === "/") {
            // Serve the user data as JSON
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (url === "/allstudent") {
            // Serve all student data from allstudent.html
            fs.readFile("allstudent.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else if (url === "/register") {
            // Serve the register form (HTML)
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else if (url === "/register.css") {
            // Serve the register.css file
            fs.readFile("register.css", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    }

    // Handling POST requests
    else if (method === "POST") {
        if (url === "/register") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                let readdata = fs.readFileSync("User.json", "utf-8");

                if (!readdata) {
                    fs.writeFileSync("User.json", JSON.stringify([]));
                } else {
                    let jsonData = JSON.parse(readdata);
                    let users = [...jsonData];

                    let convertedBody = qs.decode(body); // Parse the form data
                    users.push(convertedBody);

                    fs.writeFile("User.json", JSON.stringify(users, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end("Error saving user data.");
                        } else {
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(`<!DOCTYPE html>
                                <html lang="en">
                                  <head>
                                    <meta charset="UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <title>All Student</title>
                                    <link rel="stylesheet" href="/allstudent.css" />
                                    <style>
                                      @import url("https://fonts.googleapis.com/css2?family=Agu+Display&family=Aldrich&family=Cedarville+Cursive&family=Cinzel+Decorative:wght@400;700;900&family=Playwrite+AU+VIC+Guides&display=swap");
                                      * {
                                        margin: 0;
                                        padding: 0;
                                        box-sizing: border-box;
                                        font-family: "Aldrich", serif;
                                        font-weight: 400;
                                        font-style: normal;
                                      }
                                      body {
                                        font-family: Arial, sans-serif;
                                        background-image: url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
                                        background-position: center;
                                        background-repeat: no-repeat;
                                        background-size: cover;
                                        color: #333;
                                        padding: 20px;
                                        min-height: 100vh;
                                      }
                                      h1 {
                                        text-align: center;
                                        font-size: 5rem;
                                        color: #c8a5c1; /* Blue color for heading */
                                      }
                                        button {
                                        display: block;
                                        margin: 0 auto;
                                        padding: 10px 20px;
                                        font-size: 1.2rem;
                                        background-color:rgb(91, 79, 165); }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>Registered Successfully</h1>
                                    <button onclick="window.location.href = '/allstudent'">View All Students</button>
                                  </body>
                                </html>`);;
                        }
                    });
                }
            });
        } else {
            res.writeHead(404);
            res.end("Not Found in POST request");
        }
    }
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
