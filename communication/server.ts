import { exec, IExecResponse, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { platform } from "https://deno.land/std@0.166.0/node/os.ts";

type DenoMemory = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
};

type RealMemory = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  committed: number;
}


export const getMemory = (): DenoMemory => {
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
  encoder: TextEncoder;
  platform: string;

  constructor(port: number) {
    this.port = port;
    this.recording = false;
    this.date = new Date();
    this.ws = null;
    this.app = new Application();
    this.router = new Router();
    this.frequency = 1000;
    this.interval = 0;
    this.encoder = new TextEncoder();
    this.platform = platform();
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
    Deno.writeFile(`${this.date}.csv`, this.encoder.encode(`x,committed,heapTotal,heapUsed,external,rss\n`))
    this.recording = true;
  }
  
  stopRecord = () => {
    console.log(this.recording + ' becomes ' + false)
    this.recording = false;
  }

  record = (mem: RealMemory) => {
    console.log('in record');
    if(this.recording){
      console.log("INSIDE TEXTFILE WIRING");
      const text = this.encoder.encode(`${Math.abs((new Date()).getTime() - this.date.getTime()) / 1000},${mem.committed/1000},${mem.heapTotal/1000},${mem.heapUsed/1000},${mem.external/1000},${mem.rss}\n`);
      Deno.writeFile(`${this.date}.csv`, text, { append: true });
    }
  }

  createData = async () => {
    let memStats: IExecResponse;
    let rss: number;
    let arr: string[];
    switch(this.platform){
      case 'darwin': 
        memStats = await exec(`bash -c "ps -o rss,vsz= -p ${Deno.pid}"`, {
          output: OutputMode.Capture,
        }); // get the current rss
        rss = Number(memStats.output.split('\n')[1].trim().split(' ')[0]); // in kB
        break;
      case 'win32':
        memStats = await exec(`wmic process where processid=${Deno.pid} get WorkingSetSize`, { 
          output: OutputMode.Capture,
        });
        arr = memStats.output.split('\n');
        rss = Number(arr[arr.length - 1]);
        break;
      case 'linux':
        rss = NaN;
        break;
    }

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
  spin = async() => {
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
      clearInterval(this.interval);
      this.interval = setInterval(this.createData, this.frequency)
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
