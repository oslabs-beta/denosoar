import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";

export type MemoryElement = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
};

export const getMemory = (): MemoryElement => {
  return Deno.memoryUsage();
};

export class Server {
  #ws: WebSocketServer;
  port: number;
  recording: boolean;

  constructor(port: number) {
    this.#ws = new WebSocketServer(port);
    this.port = port;
    this.recording = false;
  }

  setRecord = () => {
    console.log("RECORDING", this.recording);
    this.recording = !this.recording;
  };

  record(mem: MemoryElement) {
    console.log("INSIDE TEXTFILE WIRING");
    const stringify = JSON.stringify(mem);
    const encoder = new TextEncoder();
    const text = encoder.encode(stringify + "\n");
    Deno.writeFile("hello.txt", text, { append: true });
  }

  // an invokable function that streams the data
  stream() {
    this.#ws.on("connection", (ws: WebSocketClient) => {
      console.log("connected");
      ws.on("message", async (message: string) => {
        if (message === "record") {
          this.setRecord();
        } else {
          const memStats =
            (await exec(`bash -c "ps -o rss,command ${Deno.pid}"`, {
              output: OutputMode.Capture,
            })); // get the current rss
          const rss = Number(memStats.output.split(" ")[2]); // in kB
          const memory = getMemory(); // get the current memory
          const decodeMem = { // decode the memory
            committed: memory.rss,
            heapTotal: memory.heapTotal,
            heapUsed: memory.heapUsed,
            external: memory.external,
            rss: rss,
          };
          if (this.recording) this.record(decodeMem);
          ws.send(JSON.stringify({
            ...decodeMem,
          }));
        }
        console.log("MEMORY", Deno.memoryUsage());
        // ps -o rss, command ${Deno.pid}
      });
    });
  }

  close() {
    this.#ws.close();
  }
}
