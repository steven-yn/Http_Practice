import net from "net";

const server = net.createServer((socket) => {
  console.log("connected.");

  socket.on("data", (data) => {
    console.log(data);
  });

  socket.on("close", () => {
    console.log("client disconnted.");
  });

  const resBody = "<html> <head></head> <body>hello world!</body> </html>";

  socket.write(
    [
      "HTTP/1.1 200 OK",
      `Content-Type: text/html;charset=UTF-8
      Content-Length: ${resBody.length}`,
      "\n",
      `${resBody}`,
    ].join("\n")
  );
});

server.on("error", (err) => {
  console.log("err" + err);
});

server.listen(5000, () => {
  console.log("linstening on 5000..");
});
