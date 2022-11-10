/** @jsx */

import MemoryChart from "../islands/MemoryChart.tsx";
import { useEffect, useState } from "preact/hooks";
import { MemoryElement } from "../utils/memory.ts";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
import Header from "../components/Header.tsx";

export default function Home() {
  console.log("hello from Home Export index.tsx");
  return (
    <div>
      <Header />
      <MemoryChart />
    </div>
  );
}
