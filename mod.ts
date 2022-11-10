import { Server } from "./communication/server.ts"
import { startApp } from "./main.ts";

export const init = () => {
  const server = new Server(3000);
  server.stream();
  startApp();
}

