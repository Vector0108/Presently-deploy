import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import {
  errorHandler,
  limitHandler,
  postHandler,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/middleware.ts";

import systemRouter from "./router/systemRouter.ts";
import socketRouter from "./router/socketRouter.ts";
import fileRouter from "./router/fileRouter.ts";

const application = new Application();

application.use(oakCors());

application.use(errorHandler);
application.use(limitHandler);
application.use(postHandler);

application.use(fileRouter.routes());
application.use(systemRouter.routes());
application.use(socketRouter.routes());

application.use(fileRouter.allowedMethods());
application.use(systemRouter.allowedMethods());
application.use(socketRouter.allowedMethods());

application.listen({ port: 8080 });
