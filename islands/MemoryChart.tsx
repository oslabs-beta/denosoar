/** @jsx */
import { MemoryElement } from "../communication/types.ts"
import { useEffect, useState } from "preact/hooks"
import { WebSocketClient, StandardWebSocketClient } from 'websocket';

interface MemoryProps {
  memory: MemoryElement
}

export default function MemoryChart(){
  const [memory, setMemory] = useState({
    rss: 0,
    heapUsed: 0,
    heapTotal: 0, 
    external: 0,
  });
  const [data, setData] = useState();
  const [open, setOpen] = useState(true);

  
  useEffect(() => {
    console.log('hello :)');
    const ws: WebSocketClient = new StandardWebSocketClient('ws://127.0.0.1:3000');
    ws.on('message', function(e: MessageEvent) {
      console.log(e.data);
      setMemory(JSON.parse(e.data));
    })
    return () => {
      ws.close(3000, 'closed')
    }
  }, [])

  return (
    <div>
      <p>rss: {memory.rss}</p>
      <p>heapTotal: {memory.heapTotal}</p>
      <p>heapUsed: {memory.heapUsed}</p>
      <p>external: {memory.external}</p>
    </div>
  )
}