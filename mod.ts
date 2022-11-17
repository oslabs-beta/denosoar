import { Server } from "./communication/server.ts"

export const init = (port: number) => {
  const server = new Server(port);
  server.spin();  
}

switch(Deno.args[0]){
  case '--start':
    (() => {
      init(Number(Deno.args[1]));
    })();
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
}

