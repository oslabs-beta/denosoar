import { WebSocketClient, WebSocketServer } from "websocket";
import { exec, OutputMode } from "exec";
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

  constructor(port: number) {
    this.#ws = new WebSocketServer(port);
    this.port = port;
  }

  // an invokable function that streams the data
  stream(){
    this.#ws.on('connection', function(ws: WebSocketClient) {
      ws.on('message', async function() {
        const memStats = (await exec(`bash -c "ps -o rss,command | grep deno"`,
        {output: OutputMode.Capture}));
        console.log(Deno.pid);
        console.log(memStats);
        const rss = Number(memStats.output.split(' ')[0]); // in kB
        ws.send(JSON.stringify({
          memory: getMemory(),
          rss: rss,
      }));
      });
    });
  }
  close() {
    this.#ws.close();
  }
}
