import { isAbsolute } from "https://deno.land/std@0.152.0/path/win32.ts";
import { assertExists, assertEquals, assertNotEquals, assertStrictEquals, assert } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { ERROR_DS_GLOBAL_CANT_HAVE_CROSSDOMAIN_MEMBER } from "https://deno.land/std@0.166.0/node/internal_binding/_winerror.ts";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {afterEach, beforeEach, describe, it,} from "https://deno.land/std@0.166.0/testing/bdd.ts";
import { getMemory, Server }  from '../communication/server.ts';
// import { delay } from "https://deno.land/std@0.165.0/async/delay.ts";


describe('Server Test', () => {
  const r = new Server(3000);

  //check server object
  it('Create new Server', () => {
    assertNotEquals(r.port, 3001, 'port is 3001')
    assertEquals(r.port, 3000, 'port does not equal 3000');
    assertEquals(r.recording, false, 'recording is true');
    assertEquals(r.ws, null, 'websocket is running');
    assertEquals(r.frequency, 1000, 'frequency is not 1000');
    assertEquals(r.interval, 0, 'interval is running');
    assertExists(r.date);
    assertExists(r.app);
    assertExists(r.encoder);
    assertExists(r.router);
  })

//run startRecord function
  it('Write initial CSV file', () => {
    r.startRecord();
    assertStrictEquals(r.recording, true, 'recording is false');
    assertNotEquals(r.recording, false, 'recording is false');
    assert(r.date);
    assertExists(Deno.writeFile);
  })
  
  // run createData function and check record
  it('Records data into the CSV file', async () => {
    r.createData()
    const memStats =
      (await exec(`bash -c "ps -o rss,vsz= -p ${Deno.pid}"`, {
        output: OutputMode.Capture,
      }));
    const rss = Number(memStats.output.split('\n')[1].trim().split(' ')[0]);
    const memory = getMemory()
    assertExists(memory.rss)
    assertExists(memory.heapTotal)
    assertExists(memory.heapUsed)
    assertExists(memory.external)
    const decodeMem = { // decode the memory
        committed: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
        rss: rss,
      };
    r.record(decodeMem)
    assertExists(decodeMem.rss);
    assertExists(decodeMem.heapTotal);
    assertExists(decodeMem.heapUsed);
    assertExists(decodeMem.committed);
    assertExists(decodeMem.external);
    assertStrictEquals(r.recording, true, 'recording is false');
    assertNotEquals(r.recording, false, 'recording is false');
    assert(Deno.writeFile);
  })

// stop recording
  it('Stop Recording Data', () => {
    r.stopRecord();
    assertStrictEquals(r.recording, false, 'recording stopped but recording is set still true');
    assertNotEquals(r.recording, true, 'recording stopped but recording is still true');
  })


})


// Deno.test('API endpoints', async () => {
//     const PORT = 4000;
//     const abort = new AbortController()
//     const { signal } = abort
//     await r.app.listen({port: PORT, signal})
//     r.spin()
//     const response = await fetch(`http://localhost:${PORT}/start`)
//     console.log(response)
//     abort.abort()
// })

// Deno.test('websocket fires', () => {
//     const record = new Server(3000);
//     const socket = new WebSocket(`ws://127.0.0.1:${record.port}/wss`)
//     record.setWS(socket)
//         assertNotEquals(record.ws.readyState, 1)
// })





