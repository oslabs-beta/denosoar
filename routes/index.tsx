/** @jsx */

import MemoryChart from '../islands/MemoryChart.tsx';
import { useState, useEffect } from 'preact/hooks';
import { MemoryElement } from '../utils/memory.ts';
import { WebSocketClient, StandardWebSocketClient } from "websocket";

export default function Home() {
  console.log
  return (
    <MemoryChart/>
  );
}