import Server from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.4/other/Server.ts";

import fileRouter from "./router/fileRouter.ts";
import socketRouter from "./router/socketRouter.ts";
import workerRouter from "./router/workerRouter.ts";
import networkRouter from "./router/networkRouter.ts";

const server = new Server();

server.add(fileRouter);
server.add(socketRouter);
server.add(workerRouter);
server.add(networkRouter);

server.listen();
