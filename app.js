const app = require("./controller");
var https = require("https");
//Estas dos líneas son para realizar la conexión segura
var fs = require("fs");

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert")
    },
    app
  )
  .listen(3443, () => {
    console.log("Https server started in port 3443");
  });
//app.listen(3000, () => console.log("Server started in port 3000"));
