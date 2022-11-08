import { HandlerContext } from "$fresh/server.ts"
export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  setInterval(() => console.log(Deno.memoryUsage()), 500);
  return new Response('started');
}

