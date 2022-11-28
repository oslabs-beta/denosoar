import { Server } from "./communication/server.ts"
import loadtest from './util/loadTest.ts';

export const init = (port: number) => {
  const server = new Server(port);
  server.spin();  
}

switch(Deno.args[0]){
  case '--example':
    (()=>init(Number(Deno.args[1])))();
    break;
  case '--start-recording':
    try {
      fetch(`http://localhost:${Deno.args[1]}/start`);
    } catch (err) {
      console.log(err.message);
    }
    break;
  case '--stop-recording': 
    try {
      fetch(`http://localhost:${Deno.args[1]}/stop`)
    } catch(err) {
      console.log(err.message);
    }
    break;
  case '--freq':
    try {
      fetch(`http://localhost:${Deno.args[1]}/interval`, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(Deno.args[2])
      });
    } catch(err) {
      console.log(err.message)
    }
    break;
  case '--lt': 
    try {
      loadtest(Deno.args[1], Deno.args[2], Deno.args[3], Deno.args[4]);
      // loadtest(url: string, concurrency: string, rps: string, duration:string)
    } catch(err) {
      console.log(err.message);
    }
    break;
  case '--gui': 
    try {
      Deno.run({
        cmd: [
          "open",
          "https://denosoar.deno.dev"
        ]
      })
    } catch(err) {
      console.log(err);
    }
}
