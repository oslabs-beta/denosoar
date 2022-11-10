/** @jsx */
import { MemoryElement } from "../communication/types.ts";
import { useEffect, useState } from "preact/hooks";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
import * as chartjs from "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"

interface MemoryProps {
  memory: MemoryElement;
}

export default function MemoryChart() {
  const [style, setStyle] = useState('line')
  
  let myChart;

  // Number of points to display on the chart
  let displaySize = 10;
  let updateCount = 0;

  useEffect(() => {
    // create ws connection with server
    const ws: WebSocketClient = new StandardWebSocketClient(
      "ws://127.0.0.1:3000",
    );
    const ctx = document.getElementById("myChart");

    let startArray = new Array(displaySize).fill(0)
    let rssData: number[] = [...startArray]
    let heapUsed: number[] = [...startArray]
    let heapTotal: number[] = [...startArray]
    let external: number[] = [...startArray]
    
    myChart = new chartjs.Chart(ctx, {
      type: style,
      data: {
        labels: [],
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
      console.log('data received')
      myChart.data.datasets.labels = [...myChart.data.labels.slice(1), new Date()];
      myChart.data.datasets[0].data = [...myChart.data.datasets[0].data.slice(1), JSON.parse(e.data).rss/1000];
      myChart.data.datasets[1].data = [...myChart.data.datasets[1].data.slice(1), JSON.parse(e.data).heapTotal/1000];
      myChart.data.datasets[2].data = [...myChart.data.datasets[2].data.slice(1), JSON.parse(e.data).heapUsed/1000];
      myChart.data.datasets[3].data = [...myChart.data.datasets[3].data.slice(1), JSON.parse(e.data).external/1000];

      if (updateCount > displaySize) {
      }

      updateCount++

      myChart.update();
    })
    return () => {
      ws.close(3000, "closed");
    };
  }, []);

  function changeStyle() {
    console.log('hi')
    setStyle( (prev: string): string => {
      if (prev === 'bar') return 'line'
      if (prev === 'line') return 'bar'
    })
    console.log(style)
  }

  useEffect( () => {
    console.log('changed')
  }, [style])

 

  return (
    <div>
      <button onClick={changeStyle}>Change the style</button>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
}
