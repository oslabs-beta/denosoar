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
      if(!Deno.args[1] || !Deno.args[2]) throw new Error('You must use the following command template:\n\n denosoar --freq port desired-frequency(number)');
      await fetch(`http://localhost:${Deno.args[1]}/start`)
    } catch (err) {
      console.error('Error: Tried to connect to port ' + Deno.args[1] + ' but something went wrong. Please try again.');
      console.error('Error:', err);
    }
    break;
  case '--stop-recording': 
    if(!Deno.args[1] || !Deno.args[2]) throw new Error('You must use the following command template:\n\n denosoar --freq port desired-frequency(number)');
    try {
      await fetch(`http://localhost:${Deno.args[1]}/stop`)
    } catch(err) {
      console.error('Error: Tried to connect to port ' + Deno.args[1] + ' but something went wrong. Please try again.');
      console.error('Error:', err);
    }
    break;
  case '--freq':
    if(!Deno.args[1] || !Deno.args[2]) throw new Error('You must use the following command template:\n\n denosoar --freq port desired-frequency(number)');
    if(Number(Deno.args[2]) === NaN) throw new Error('Frequency must be a number.')
    try {
      fetch(`http://localhost:${Deno.args[1]}/interval`, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(Deno.args[2])
      });
    } catch(err) {
      console.error('Error: Tried to connect to port ' + Deno.args[1] + ' but something went wrong. Please try again.');
      console.error('Error:', err);
    }
    break;
  case '--lt': 
    if(Deno.args.length !== 5) throw new Error('Error: You must use the following command template:\n\n denosoar --lt url(string) concurrency(number) rps(number) duration(number)');
    if(Number(Deno.args[2]) === NaN || Number(Deno.args[3]) === NaN || Number(Deno.args[4]) === NaN) throw new Error('Error: The last three arguments must be numbers.')
    try {
      loadtest(Deno.args[1], Deno.args[2], Deno.args[3], Deno.args[4]);
    } catch(err) {
      console.error('Error: Tried to connect to port ' + Deno.args[1] + ' but something went wrong. Please try again.');
      console.error('Error:', err);
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
      console.error('Error: Something went wrong.');
    }
    break;
  case '--help': 
    console.log(`
      commands: 

      --example: start the example
      --start-recording <port #>: start recording a .csv file in the denosoar server listening at this port
      --stop-recording <port #>: stop recording the .csv file in the denosoar server listening at this port
      --freq <port #> <desired-frequency>: change the frequency of data collection in the denosoar server listening at this port
      --lt <url> <concurrency> <rps> <duration>: utilize our beta version load testing tool - please report issues via github
      --gui: open the gui 
    `)
    break;
  default: 
    console.error('Not a valid command. Type denosoar --help for help.');
}
