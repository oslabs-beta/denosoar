import { exec, IExecResponse, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { platform } from "https://deno.land/std@0.166.0/node/os.ts";
import { RealMemory } from "../util/types.ts";

/**
 * A server that can be spun up inside any process and will mine and transmit memory data via a Websocket connection.
 * The server contains simple endpoints that allow the user to interact with the way data is being mined/transmitted. 
 */
 export class Server {
  private port: number;
  public recording: boolean;
  public date: Date;
  private ws: WebSocket | null;
  private app: Application;
  private router: Router;
  private frequency: number;
  private interval: number;
  private encoder: TextEncoder;
  private platform: string;
  private controller: AbortController;

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
    this.controller = new AbortController();
  }
 
  /**
   * setWS and deleteWS allow for mutable Websocket connections.
   * The user can freely disconnect and reconnect via the GUI.
   */
  private setWS = (ws: WebSocket) => {
    return this.ws = ws;
  }
  private deleteWS = () => {
    return this.ws = null;
  }

  /**
   * stopRecord and startRecord allow the user to sample data at different times.
   * New files will be created with the current date each time startRecord is called.
   * Files are created in the repo where the server is initialized.
   */
  public startRecord = () => {
    this.date = new Date();
    this.recording = true;
    return Deno.writeFile(`${this.date}.csv`, this.encoder.encode(`x,committed,heapTotal,heapUsed,external,rss\n`))
  }
  public stopRecord = () => {
    return this.recording = false;
  }

  /**
   * Writes the memory data to a csv file for as long as requested.
   * CSV files can be processed on the GUI.
   */
  public record = (mem: RealMemory) => {
    const text = this.encoder.encode(`${Math.abs((new Date()).getTime() - this.date.getTime()) / 1000},${mem.committed/1000},${mem.heapTotal/1000},${mem.heapUsed/1000},${mem.external/1000},${mem.rss}\n`);
    return Deno.writeFile(`${this.date}.csv`, text, { append: true });
  }

  /**
   * Generate data in an OS dependent form, record/send the data if requested.
   * Deno's memoryUsage() function generates an incorrect value for rss, so this is calculated via the terminal.
   */
  public createData = async () => {
    let memStats: IExecResponse;
    let rss: number;
    let arr: string[];
    switch(this.platform){
      case 'darwin': // Mac
        memStats = await exec(`bash -c "ps -o rss,vsz= -p ${Deno.pid}"`, {
          output: OutputMode.Capture,
        }); 
        rss = Number(memStats.output.split('\n')[1].trim().split(' ')[0]); // in kB
        break;
      case 'win32': // Windows
        memStats = await exec(`wmic process where processid=${Deno.pid} get WorkingSetSize`, { 
          output: OutputMode.Capture,
        });
        arr = memStats.output.split('\n');
        rss = Number(arr[arr.length - 1])/1000; // Windows generates WorkingSetSize(RSS) in bytes instead of kB
        break;
      case 'linux': // Linux
        memStats = await exec(`bash -c "cat /proc/${Deno.pid}/status | grep VmRSS`, {
          output: OutputMode.Capture,
        });
        arr = memStats.output.split(' ');
        rss = Number(arr[arr.length - 2]); // in kB
        break;
      default:
        rss = 0;
        break;
    }
    const memory = Deno.memoryUsage(); 
    const decodeMem = { 
      committed: memory.rss, 
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external,
      rss: rss,
    };
    if(this.recording) this.record(decodeMem);
    if(this.ws) this.ws.send(JSON.stringify({ ...decodeMem }));
  }

  public close = () => {
    this.controller.abort();
  }

  /**
   * Spins up the server and allows the user to interact with the server via simple endpoints.
   */
  public spin = async () => {
    this.router.get('/wss', (ctx) => {
      if(!ctx.isUpgradable) {
        ctx.throw(501);
      } else {
        const ws = ctx.upgrade();
        ws.onopen = () => this.setWS(ws);
        ws.onclose = () => this.deleteWS();
        ws.onerror = (e) => console.log(e);
      }
    }).get('/start', (ctx) => {
      if(!this.recording) {
        this.startRecord();
      }
      ctx.response.status = 200
      return ctx.response.status;
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
    });
    this.app.use(this.router.allowedMethods());
    this.app.use(this.router.routes());

    // The server generates new data every frequency seconds. 
    this.interval = setInterval(this.createData, this.frequency);

    await this.app.listen({ port: this.port })
    console.log('Waiting for connection on port: ' + this.port);
  }
 }
