import { reset } from "https://deno.land/std@0.152.0/fmt/colors.ts";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

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
  port: number;
  recording: boolean;
  date: Date;
  ws: WebSocket | null;
  app: Application;
  router: Router;
  frequency: number;
  interval: number;

  constructor(port: number) {
    this.port = port;
    this.recording = false;
    this.date = new Date();
    this.ws = null;
    this.app = new Application();
    this.router = new Router();
    this.frequency = 1000;
    this.interval = 0;
  }

  setWS = (ws: WebSocket) => {
    console.log(ws);
    this.ws = ws;
  }

  deleteWS = () => {
    console.log('deleted');
    this.ws = null;
  }

  startRecord = () => {
    console.log(this.recording + ' becomes ' + true)
    this.date = new Date();
    this.recording = true;
  }
  
  stopRecord = () => {
    console.log(this.recording + ' becomes ' + false)
    this.recording = false;
  }

  record(mem: MemoryElement) {
    console.log('in record');
    if(this.recording){
      console.log("INSIDE TEXTFILE WIRING");
      const stringify = JSON.stringify(mem);
      const encoder = new TextEncoder();
      const text = encoder.encode(`${Math.abs((new Date()).getTime() - this.date.getTime()) / 1000}_${stringify}\n`);
      Deno.writeFile(`${this.date}.txt`, text, { append: true });
    }
  }

  createData = async () => {
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
    if(this.recording) this.record(decodeMem);
    if(this.ws) this.ws.send(JSON.stringify({ ...decodeMem }));
  }

  // an invokable function that streams the data
  async spin() {
    this.router.get('/wss', (ctx) => {
      if(!ctx.isUpgradable) {
        ctx.throw(501);
      } else {
        const ws = ctx.upgrade();
        ws.onopen = () => this.setWS(ws);
        ws.onclose = () => this.deleteWS();
        ws.onerror = (e) => console.log(e);
      }
    }).get('/start', () => {
      if(!this.recording) {
        this.startRecord();
      }
    }).get('/stop', () => {
      if(this.recording) {
        this.stopRecord();
      }
    }).get('/recording', (ctx) => {
      ctx.response.body = this.recording;
    }).post('/interval', async (ctx) => {
      const num = await ctx.request.body().value;
      this.frequency = JSON.parse(num);
      // console.log(`Changing the sampling frequency to ${this.frequency} ms.`);

      clearInterval(this.interval);
      this.interval = setInterval(this.createData, this.frequency)
      // console.log('new interval: ', this.interval, '. New freq: ', this.frequency)

      ctx.response.status = 200;
    })

    this.app.addEventListener('listen', () => {
      console.log(`Listening on post: ` + this.port);
    })
    this.app.use(this.router.allowedMethods());
    this.app.use(this.router.routes());

    this.interval = setInterval(this.createData, this.frequency);

    await this.app.listen({ port: this.port })
    console.log('Waiting for connection on port: ' + this.port);
  }
}
