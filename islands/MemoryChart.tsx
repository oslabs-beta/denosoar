/** @jsx */
import { MemoryElement } from "../communication/types.ts";
import { useEffect, useState } from "preact/hooks";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
import * as chartjs from "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js";

interface MemoryProps {
  memory: MemoryElement;
}

export default function MemoryChart() {
  // Number of points to display on the chart
  let displaySize = 50;
  const label: number[] = [];
  for (let i = 0; i < displaySize; i++) {
    label.push(i - displaySize);
  }

  const startArray = new Array(displaySize).fill(0);
  const rssData: number[] = [...startArray];
  const commitHeap: number[] = [...startArray];
  const heapUsed: number[] = [...startArray];
  const heapTotal: number[] = [...startArray];
  const external: number[] = [...startArray];

  useEffect(() => {
    let ws: WebSocketClient = new StandardWebSocketClient(
      "ws://127.0.0.1:3000",
    );
    ws.on("open", function () {
      setInterval(() => {
        ws.send("give me data");
      }, 1000);
    });
    const ctx1 = document.getElementById("myLineChart");
    const ctx2 = document.getElementById("myBarChart");
    console.log('i am here')
    const lineChart = new chartjs.Chart(ctx1, {
      type: 'line',
      data: {
        labels: label,
        datasets: [
          {
            label: "RSS",
            data: [...rssData],
            backgroundColor: [
              "rgba(105, 0, 132, .2)",
            ],
            borderColor: [
              "rgba(200, 99, 132, .7)",
            ],
            fill: true,
            borderWidth: 1,
            tension: 0.5,
          },
          {
            label: "Committed Heap (kB)",
            data: [...commitHeap],
            backgroundColor: [
              'rgba(0, 20, 20, .2)',
            ],
            borderColor: [
              'rgba(0, 30, 20, .7)',
            ],
            fill: true,
            borderWidth: 1,
          },
          {
            label: "Heap Total",
            data: [...heapTotal],
            backgroundColor: [
              "rgba(0, 137, 132, .2)",
            ],
            borderColor: [
              "rgba(0, 10, 130, .7)",
            ],
            fill: true,
            borderWidth: 1,
          },
          {
            label: "Heap Used",
            data: [...heapUsed],
            backgroundColor: [
              "rgba(0, 255, 0, .2)",
            ],
            borderColor: [
              "rgba(0, 153, 0, .7)",
            ],
            fill: true,
            borderWidth: 1,
            tension: 0.5,
          },
          {
            label: "External",
            data: [...external],
            backgroundColor: [
              "rgba(255, 102, 78, .2)",
            ],
            borderColor: [
              "rgba(255, 0, 127, .7)",
            ],
            fill: true,
            borderWidth: 1,
            tension: 0.5,
          },
        ],
      },
      options: {
        scales: {
          yAxes: {
            suggestedmax: 6000,
            suggestedmin: 0,
            ticks: {
              stepSize: 1000,
            },
          },
        },
      },
    });
    const barChart = new chartjs.Chart(ctx2, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: "RSS",
            data: [...rssData],
            backgroundColor: [
              "rgba(105, 0, 132, .2)",
            ],
            borderColor: [
              "rgba(200, 99, 132, .7)",
            ],
            fill: true,
            borderWidth: 1,
            tension: 0.5,
          },
          {
            label: "Committed Heap (kB)",
            data: [...commitHeap],
            backgroundColor: [
              'rgba(0, 20, 20, .2)',
            ],
            borderColor: [
              'rgba(0, 30, 20, .7)',
            ],
            fill: true,
            borderWidth: 1,
          },
          {
            label: "Heap Total",
            data: [...heapTotal],
            backgroundColor: [
              "rgba(0, 137, 132, .2)",
            ],
            borderColor: [
              "rgba(0, 10, 130, .7)",
            ],
            fill: true,
            borderWidth: 1,
          },
          {
            label: "Heap Used",
            data: [...heapUsed],
            backgroundColor: [
              "rgba(0, 255, 0, .2)",
            ],
            borderColor: [
              "rgba(0, 153, 0, .7)",
            ],
            fill: true,
            borderWidth: 1,
            tension: 0.5,
          },
          {
            label: "External",
            data: [...external],
            backgroundColor: [
              "rgba(255, 102, 78, .2)",
            ],
            borderColor: [
              "rgba(255, 0, 127, .7)",
            ],
            fill: true,
            borderWidth: 1,
            tension: 0.5,
          },
        ],
      },
      options: {
        scales: {
          yAxes: {
            suggestedmax: 6000,
            suggestedmin: 0,
            ticks: {
              stepSize: 1000,
            },
          },
        },
      },
    });
    ws.on("message", function (e: MessageEvent) {
      lineChart.data.labels = lineChart.data.labels.map((x: number) => x + 1);
      lineChart.data.datasets[0].data = [
        ...lineChart.data.datasets[0].data.slice(1),
        JSON.parse(e.data).rss,
      ];
      lineChart.data.datasets[1].data = [
        ...lineChart.data.datasets[1].data.slice(1),
        JSON.parse(e.data).memory.rss / 1000,
      ];
      lineChart.data.datasets[2].data = [
        ...lineChart.data.datasets[2].data.slice(1),
        JSON.parse(e.data).memory.heapTotal / 1000,
      ];
      lineChart.data.datasets[3].data = [
        ...lineChart.data.datasets[3].data.slice(1),
        JSON.parse(e.data).memory.heapUsed / 1000,
      ];
      lineChart.data.datasets[4].data = [
        ...lineChart.data.datasets[4].data.slice(1),
        JSON.parse(e.data).memory.external / 1000,
      ];
      lineChart.update();

      barChart.data.labels = barChart.data.labels.map((x: number) => x + 1);
      barChart.data.datasets[0].data = [
        ...barChart.data.datasets[0].data.slice(1),
        JSON.parse(e.data).rss,
      ];
      barChart.data.datasets[1].data = [
        ...barChart.data.datasets[1].data.slice(1),
        JSON.parse(e.data).memory.rss / 1000,
      ];
      barChart.data.datasets[2].data = [
        ...barChart.data.datasets[2].data.slice(1),
        JSON.parse(e.data).memory.heapTotal / 1000,
      ];
      barChart.data.datasets[3].data = [
        ...barChart.data.datasets[3].data.slice(1),
        JSON.parse(e.data).memory.heapUsed / 1000,
      ];
      barChart.data.datasets[4].data = [
        ...barChart.data.datasets[4].data.slice(1),
        JSON.parse(e.data).memory.external / 1000,
      ];
      barChart.update();
    });
    // document.addEventListener('unload', async () => {
    //   return await ws.close(1, 'closed');
    // })
    return async () => {
      ws.removeAllListeners();
      lineChart.destroy();
      barChart.destroy();
      return await ws.close(1, 'closed');
    }
  }, [])

  

  function toggleGraph(){
    const line = document.getElementById('line')?.classList.contains('hidden');
    console.log(line, "hi");
    if(line){
      document.getElementById('bar')?.setAttribute('class', 'hidden');
      document.getElementById('line')?.classList.remove('hidden');
    } else {
      document.getElementById('line')?.setAttribute('class', 'hidden');
      document.getElementById('bar')?.classList.remove('hidden');
    }
  }
  return (
    <div class="block" id="chartContainer">
      <h1>Memory Usage</h1>
      <div id="line">
        <button class="" id='barBtn' onClick={toggleGraph}>Bar Chart</button>
        <canvas id="myLineChart"></canvas>
      </div>
      <div id="bar" class="hidden">
        <button class="" id='lineBtn' onClick={toggleGraph}>Line Chart</button>
        <canvas id="myBarChart"></canvas>
      </div>
    </div>
  );
}
