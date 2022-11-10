import { WebSocketClient, WebSocketServer } from "websocket";
import { getMemory } from "../utils/memory.ts";

export class Server {
  #ws: WebSocketServer;
  port: number;

  constructor(callback: Function, port: number) {
    this.#ws = new WebSocketServer(port);
    this.port = port;
  }

  // an invokable function that streams the data
  stream() {
    this.#ws.on("connection", function (ws: WebSocketClient) {
      ws.on("message", function (e: MessageEvent) {
        ws.send(JSON.stringify(getMemory()));
      });
    });
  }

  close() {
    this.#ws.close();
  }
}

const server = new Server(getMemory, 3000);
server.stream();
