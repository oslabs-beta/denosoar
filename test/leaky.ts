import { init } from '../mod.ts'

// create an array to store strings
const leak: string[] = [];

// every second, add 1000 strings to the array
setInterval(function(): void {
  for (let i = 0; i < 1000; i++) {
    const str: string = i.toString() + " hello, hello, hello!";
    leak.push(str);
  }
}, 1000);

// initialize the memory log
init();