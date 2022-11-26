import { isAbsolute } from "https://deno.land/std@0.152.0/path/win32.ts";
import { assertExists, assertEquals, assertNotEquals, assertStrictEquals, assert } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
//import {afterEach, beforeEach, describe, it,} from "https://deno.land/std@0.166.0/testing/bdd.ts";
import { getMemory, Server }  from '../communication/server.ts';
// import { delay } from "https://deno.land/std@0.165.0/async/delay.ts";

const r = new Server(3000);


Deno.test('on startup', () => {
    assertNotEquals(r.port, 3001, 'port is 3001')
    assertEquals(r.port, 3000, 'port does not equal 3000');
    assertEquals(r.recording, false, 'recording is true');
    assertEquals(r.ws, null, 'websocket is running');
    assertEquals(r.frequency, 1000, 'frequency is not 1000')
    assertEquals(r.interval, 0, 'interval is running');
})

Deno.test('exists', () => {
    assertExists(r.date);
    assertExists(r.app);
    assertExists(r.encoder);
    assertExists(r.router);
    console.log(r)
})

// Deno.test('API endpoints', async () => {
//     const PORT = r.port;
//     const abort = new AbortController()
//     const { signal } = abort
//     await r.app.listen({port: PORT, signal})
//     console.log(r)
//     r.spin()
//     const response = await fetch(`http://localhost:${PORT}/start`)
//     abort.abort()
// })

// Deno.test('websocket fires', () => {
//     const record = new Server(3000);
//     const socket = new WebSocket(`ws://127.0.0.1:${record.port}/wss`)
//     record.setWS(socket)
//         assertNotEquals(record.ws.readyState, 1)
// })

Deno.test('when recording starts',  () => {
    r.startRecord();
    assertStrictEquals(r.recording, true, 'recording is false');
    assertNotEquals(r.recording, false, 'recording is false');
    assert(r.date);
    assertExists(Deno.writeFile);
})

Deno.test('record data into csv file', async () => {
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


Deno.test('when recording stops', () => {
    r.stopRecord();
    assertStrictEquals(r.recording, false, 'recording stopped but recording is set still true');
    assertNotEquals(r.recording, true, 'recording stopped but recording is still true');
})

