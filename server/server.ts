import { Application, Router } from "../deps.ts";
import App from '../client/App.tsx';

export const server = async () => {
  // listen to the user's memory
  const listenToMemory = () => {
    setInterval(() =>  console.log(Deno.memoryUsage()), 500);
  }

  const router = new Router();
  const app = new Application();
  const port = 8000;

  //use router
  app.use(router.routes());
  app.use(router.allowedMethods());



  app.use(async (ctx, next) => {
    await next();
    console.log(`METHOD: ${ctx.request.method}, URL: ${ctx.request.url}`);
    ctx.response.body = App
  });


  // route methods 
  router.get('/api', (ctx) => {
    ctx.response.body = "API GET REQUEST"
  });

  await app.listen({ port });
}

server();