/** @jsx */

import MemoryChart from '../islands/MemoryChart.tsx';
import Header from '../components/Header.tsx';

export default function Home() {
  console.log(Deno.memoryUsage());
  return (
    <div class="flex-1 justify-center items-center">
      <Header />
      <MemoryChart/>
    </div>
  );
}