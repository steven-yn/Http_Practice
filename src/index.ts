import { promises as dns, ADDRCONFIG, V4MAPPED } from "dns";
import tls from "tls";
import cheerio from "cheerio";
import { Socket } from "dgram";
import { send } from "process";

// function whenReceive(socket: tls.TLSSocket): Promise<string> {
//   return new Promise((resolve) => {
//     let data = "";
//     let first = true;
//     socket.on("data", (chunk: any) => {
//       if (first) {
//         // 첫 청크는 무조건 헤더이므로 거름
//         first = false;
//         return;
//       }
//       // 이후부터 Body 즉 HTML만 받음
//       data += chunk;
//     });
//     socket.once("end", () => {
//       socket.end();
//       resolve(data);
//     });
//   });
// }

async function getIP(): Promise<{ host: string; address: string }> {
  const host = "www.google.com";
  const { address } = await dns.lookup(host, {
    family: 4,
    hints: ADDRCONFIG | V4MAPPED,
  });

  // console.log(host, address);

  return { host: host, address: address };
}

function getResponse(socket: tls.TLSSocket): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    let first = true;
    socket.on("data", (chunk) => {
      // console.log(chunk);

      if (first) {
        // 첫 청크는 무조건 헤더이므로 거름
        first = false;
        return;
      }
      // 이후부터 Body 즉 HTML만 받음
      data += chunk;
    });

    console.log(data);

    socket.once("end", () => {
      console.log("dd");
      socket.end();
      resolve(data);
    });
  });
}

const ex = async () => {
  const { host, address } = await getIP();
  let out = "";

  const HTTP_CALL = async () => {
    socket.write(
      [
        "GET /search?q=hello&hl=ko HTTP/1.1",
        `Host: ${host}`,
        "User-Agent: HereAgent",
        "\n",
      ].join("\n")
    );

    // console.log(await getResponse(socket), "soc");

    out = await getResponse(socket);
  };

  const socket = tls.connect(
    {
      host: address,
      port: 443,
      rejectUnauthorized: false,
    },
    HTTP_CALL
  );

  return out;
};

import express, { Request, Response, NextFunction } from "express";

const app = express();

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const sending = await ex();

  console.log(sending);

  res.send("loading");
  await res.send(sending);
});

app.listen("1234");
