import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";

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
    console.log(Deno.memoryUsage());
    this.#ws.on('connection', function(ws: WebSocketClient) {
      ws.on('message', async function() {
        // ps -o rss, command ${Deno.pid}
        const memStats = (await exec(`bash -c "ps -o rss,command ${Deno.pid}"`,
        {output: OutputMode.Capture}));
        console.log(Deno.pid);
        const rss = Number(memStats.output.split(' ')[2]); // in kB
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
