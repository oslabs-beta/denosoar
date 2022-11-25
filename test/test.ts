import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import  {Server}  from '../communication/server.ts';
import { delay } from "https://deno.land/std@0.165.0/async/delay.ts";



Deno.test('on startup', () => {
    const record = new Server(3000)
    assertEquals(record.port, 3000)
    assertEquals(record.recording, false)
    assertEquals(record.ws, null)
})

// Deno.test('on startup', () => {
//     const record = new Server(3000)
//     assertEquals(record.recording, false)
// })

// Deno.test('API endpoints', async () => {

// })