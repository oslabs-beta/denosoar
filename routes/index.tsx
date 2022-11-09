/** @jsx */

import MemoryChart from '../islands/MemoryChart.tsx';
import { useState, useEffect } from 'preact/hooks';
import { MemoryElement } from '../utils/memory.ts';
import { WebSocketClient, StandardWebSocketClient } from "websocket";
import Header from '../components/Header.tsx';

export default function Home() {
  console.log("hello from Home Export index.tsx")
  return (
    <div>

      <Header />
      <MemoryChart/>
    
    </div>
  );
}