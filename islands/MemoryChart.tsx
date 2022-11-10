/** @jsx */
import { MemoryElement } from "../communication/types.ts";
import { useEffect, useState } from "preact/hooks";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
import * as chartjs from "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js";

interface MemoryProps {
  memory: MemoryElement;
}

export default function MemoryChart() {
  let myChart;
  let currentStyle = "line";
  let socketOn = false;

  // Number of points to display on the chart
  let displaySize = 20;
  const label: number[] = [];
  for (let i = 0; i < displaySize; i++) {
    label.push(i - displaySize);
  }

  function outer() {
    // create ws connection with server
    console.log("GOT OUTSIDE!");
    const ws: WebSocketClient = new StandardWebSocketClient(
      "ws://127.0.0.1:3000",
    );

    ws.on("open", function () {
      setInterval(() => {
        ws.send("give me data");
      }, 1000);
    });

    ///////// INNER FUNCTION /////////
    return function inner(parameter: string) {
      /// Paste chart code here.
      console.log("GOT INSIDE!");
      const ctx = document.getElementById("myChart");

      let startArray = new Array(displaySize).fill(null);
      let rssData: number[] = [...startArray];
      let heapUsed: number[] = [...startArray];
      let heapTotal: number[] = [...startArray];
      let external: number[] = [...startArray];

      myChart = new chartjs.Chart(ctx, {
        type: parameter,
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

      if (!socketOn) {
        socketOn = true;
        ws.on("message", function (e: MessageEvent) {
          console.log("data received");
          myChart.data.labels = myChart.data.labels.map((x) => x + 1);
          myChart.data.datasets[0].data = [
            ...myChart.data.datasets[0].data.slice(1),
            JSON.parse(e.data).rss / 1000,
          ];
          myChart.data.datasets[1].data = [
            ...myChart.data.datasets[1].data.slice(1),
            JSON.parse(e.data).heapTotal / 1000,
          ];
          myChart.data.datasets[2].data = [
            ...myChart.data.datasets[2].data.slice(1),
            JSON.parse(e.data).heapUsed / 1000,
          ];
          myChart.data.datasets[3].data = [
            ...myChart.data.datasets[3].data.slice(1),
            JSON.parse(e.data).external / 1000,
          ];
          myChart.update("none");
        });
      }

    };
  }

  // Function to create a new chart
  function changeStyle(param: string) {
    // Destroy chart and recreate a new type
    if (myChart && param !== currentStyle) {
      currentStyle = param;

      myChart.destroy();
    }
    changeType(param);
  }

  const changeType = outer();

  return (
    <div class="block">
      <button class='border-2 border black'
        onClick={() => {
          changeStyle("line");
        }}
      >
        Line Graph
      </button>
      <button class='border-2 border black'
        onClick={() => {
          changeStyle("bar");
        }}
      >
        Bar Graph
      </button>
      <canvas id="myChart"></canvas>
    </div>
  );
}
