import { assertExists, assertNotEquals, assertStrictEquals, assert } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { exec, OutputMode } from "https://deno.land/x/exec@0.0.5/mod.ts";
import { describe, it } from "https://deno.land/std@0.166.0/testing/bdd.ts";
import { Server }  from '../communication/server.ts';

describe('Server Test', () => {
  const r = new Server(3000);
  r.spin();

  it('Write initial CSV file', () => {
    r.startRecord();
    assertStrictEquals(r.recording, true, 'recording is false');
    assertNotEquals(r.recording, false, 'recording is false');
    assert(r.date);
    assertExists(Deno.writeFile);
  })
  
  it('Records data into the CSV file', async () => {
    r.createData()
    const memStats =
      (await exec(`bash -c "ps -o rss,vsz= -p ${Deno.pid}"`, {
        output: OutputMode.Capture,
      }));
    const rss = Number(memStats.output.split('\n')[1].trim().split(' ')[0]);
    const memory = Deno.memoryUsage()
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


  it('Stop Recording Data', () => {
    r.stopRecord();
    assertStrictEquals(r.recording, false, 'recording stopped but recording is set still true');
    assertNotEquals(r.recording, true, 'recording stopped but recording is still true');
  })
})


