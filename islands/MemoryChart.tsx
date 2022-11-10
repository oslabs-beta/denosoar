/** @jsx */
import { MemoryElement } from "../communication/types.ts";
import { useEffect, useState } from "preact/hooks";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
import * as chartjs from "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"

interface MemoryProps {
  memory: MemoryElement;
}

export default function MemoryChart() {
  // const [memory, setMemory] = useState({
 
  //   rss: 0,
  //   heapUsed: 0,
  //   heapTotal: 0,
  //   external: 0,
  // });
  // const [data, setData] = useState();
  // const [open, setOpen] = useState(true);
  // const [rssData, setRssData] = useState([])
  



  let myChart;

const [graph, setGraph] = useState('line')
  useEffect(() => {
    // create ws connection with server
    const ws: WebSocketClient = new StandardWebSocketClient(
      "ws://127.0.0.1:3000",
    );
    const ctx = document.getElementById("myChart");
    let rssData: number[] = [0,0,0,0,0,0,0,0,0,0]
    let heapUsed: number[] = [0,0,0,0,0,0,0,0,0,0]
    let heapTotal: number[] = [0,0,0,0,0,0,0,0,0,0]
    let external: number[] = [0,0,0,0,0,0,0,0,0,0]
    
    myChart = new chartjs.Chart(ctx, {
      type: graph,
      data: {
        labels: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1],
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
    
    setInterval(() => {
      ws.send('message', function(){
        console.log('give me the data');
      });
      myChart.update(0)
    }, 1000)
    ws.on('message', function(e: MessageEvent){
      console.log('data received')
      myChart.data.labels = myChart.data.labels.map(x => x+1);
      myChart.data.datasets[0].data = [...myChart.data.datasets[0].data.slice(1), JSON.parse(e.data).rss/1000];
      myChart.data.datasets[1].data = [...myChart.data.datasets[1].data.slice(1), JSON.parse(e.data).heapTotal/1000];
      myChart.data.datasets[2].data = [...myChart.data.datasets[2].data.slice(1), JSON.parse(e.data).heapUsed/1000];
      myChart.data.datasets[3].data = [...myChart.data.datasets[3].data.slice(1), JSON.parse(e.data).external/1000];
      console.log(e.data)
      myChart.update();
    })
    return () => {
      ws.close(3000, "closed");
    };
  }, []);

 
  return (
    <div>

      <canvas id="myChart"></canvas>
    </div>
  );
}
