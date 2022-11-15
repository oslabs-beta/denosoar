/** @jsx */

import MemoryChart from "../islands/MemoryChart.tsx";
import Header from "../components/Header.tsx";
 console.log(Deno.memoryUsage());

export default function Home() {
  console.log("hello from Home Export index.tsx");
  return (
    <div>
      <Header />
      <MemoryChart />
    </div>
  );
}
