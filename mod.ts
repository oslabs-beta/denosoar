import { Server } from "./communication/server.ts"


export const init = () => {
  const server = new Server(3000);
  server.stream();  
}
