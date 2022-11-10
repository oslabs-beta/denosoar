/** @jsx */

import { useEffect, useState } from "preact/hooks";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
import * as chartjs from "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"

export default function MemoryChart() {
  const [type, setType] = useState('line');
  useEffect(() => {
    // create ws connection with server
    const ws: WebSocketClient = new StandardWebSocketClient(
      "ws://127.0.0.1:3000",
    );
    const ctx = document.getElementById("myChart");
    const rssData: number[] = new Array(100).fill(0);
    const heapUsed: number[] = new Array(100).fill(0);
    const heapTotal: number[] = new Array(100).fill(0);
    const external: number[] = new Array(100).fill(0);
    const labels: number[] = new Array(100);
    for(let i = 0; i < labels.length; i++){
      labels[i] = i - 100;
    }
    const myChart = new chartjs.Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
          label: "RSS",
          data: [...rssData],
          backgroundColor: [
            'rgba(105, 0, 132, .2)',
          ],
          borderColor: [
            'rgba(200, 99, 132, .7)'
          ],
          fill: true,
          borderWidth: 1,
        },
        {
          label: "Heap Total",
          data: [...heapTotal],
          backgroundColor: [
            'rgba(0, 137, 132, .2)',
          ],
          borderColor: [
            'rgba(0, 10, 130, .7)',
          ],
          fill: true,
          borderWidth: 1,
        },
        {
          label: 'Heap Used',
          data: [...heapUsed],
          backgroundColor: [
            'rgba(0, 255, 0, .2)',
          ],
          borderColor: [
            'rgba(0, 153, 0, .7)',
          ],
          fill: true,
          borderWidth: 1,
          tension: 0.1
        },
        {
          label: 'External',
          data: [...external],
          backgroundColor: [
            'rgba(255, 102, 78, .2)',
          ],
          borderColor: [
            'rgba(255, 0, 127, .7)',
          ],
          fill: true,
          borderWidth: 1,
          tension: 0.1
        },
      ],
        
      },
      options: {
        scales: {
          yAxes: {
            suggestedmax: 6000,
            suggestedmin: 0,
            ticks: {
              stepSize: 1000
            }
          }

        }
      }
    });
    ws.on('open', function(){
      setInterval(()=>{
        ws.send('give me data');
      }, 1000)
    })
     
    ws.on('message', function(e: MessageEvent){
      console.log(e);
      myChart.data.labels = myChart.data.labels.map((x: number) => x+1);
      myChart.data.datasets[0].data = [...myChart.data.datasets[0].data.slice(1), JSON.parse(e.data).rss/1000];
      myChart.data.datasets[1].data = [...myChart.data.datasets[1].data.slice(1), JSON.parse(e.data).heapTotal/1000];
      myChart.data.datasets[2].data = [...myChart.data.datasets[2].data.slice(1), JSON.parse(e.data).heapUsed/1000];
      myChart.data.datasets[3].data = [...myChart.data.datasets[3].data.slice(1), JSON.parse(e.data).external/1000];
      myChart.update();
    })
    return () => {
      ws.close(3000, "closed");
    };
  }, [type]);

 

  return (
    <div class="w-5/6">
      <canvas id="myChart"></canvas>
    </div>
  );
}
