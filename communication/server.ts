import { WebSocketClient, WebSocketServer } from "websocket";
import { getMemory } from "../utils/memory.ts";

export class Server {
  #ws: WebSocketServer;
  port: number;

  constructor(callback: Function, port: number){
    this.#ws = new WebSocketServer(port);
    this.port = port;
  }

  // an invokable function that streams the data
  stream(){
    this.#ws.on('connection', function(ws: WebSocketClient) {
      console.log('connected to ws on ' + this.port)
      setInterval(() => ws.send(JSON.stringify(getMemory())),1000);
    })
  }

  close(){
    this.#ws.close();
  }
}


const server = new Server(getMemory, 3000);
server.stream();