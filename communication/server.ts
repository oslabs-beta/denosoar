import { WebSocketClient, WebSocketServer } from "websocket";

export type MemoryElement = { 
  rss: number, 
  heapTotal: number,
  heapUsed: number,
  external: number
}

export const getMemory = (): MemoryElement => {
  console.log(Deno.memoryUsage());
  return Deno.memoryUsage();
}
export class Server {
  #ws: WebSocketServer;
  port: number;

  constructor(port: number){
    this.#ws = new WebSocketServer(port);
    this.port = port;
  }

  // an invokable function that streams the data
  stream(){
    this.#ws.on('connection', function(ws: WebSocketClient) {
      ws.on('message', function() {
        ws.send(JSON.stringify(getMemory()));
      });
    });
  }

  close(){
    this.#ws.close();
  }
}

