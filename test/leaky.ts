/**
 * A leaking file to test denosoar.
 */
import { init } from "../mod.ts";

const leak: string[] = [];

setInterval(function (): void {
  for (let i = 0; i < 1000; i++) {
    const str: string = i.toString() + " hello, hello, hello!";
    leak.push(str);
  }
}, 1000);

init(3000);