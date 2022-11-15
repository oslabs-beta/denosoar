import { Server } from "./communication/server.ts"
import * as graph from './main.ts'

export const init = (port: number) => {
  const server = new Server(port);
  server.stream();  
}

switch(Deno.args[0]){
  case '--start':
    (() => {
      init(3000);
      graph.init(Number(Deno.args[1]));
    })();
    break;
}

