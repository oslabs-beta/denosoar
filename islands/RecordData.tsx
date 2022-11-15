import { MemoryElement } from "../communication/types.ts";
import { useEffect, useState } from "preact/hooks";
import { StandardWebSocketClient, WebSocketClient } from "websocket";
//import { MemoryChart } from './MemoryChart.tsx'

// const fileData = JSON.stringify(MessageEvent);
// const blob = new Blob([fileData], { type: "text/plain" });

export default function RecordData(props: any) {
function buttonClick() {
    // Create the websocket
    props.ws.send('record');

    // await ws.close(1000, 'closed');
    // check to see if the start button is clicked
    const record = document.getElementById("off-button")?.classList.contains(
      "hidden",
    );
    // if start button was clicked
    if (record) {
      // change the start button to hidden and bring up the off button
      document.getElementById("on-button")?.setAttribute("class", "hidden");
      document.getElementById("off-button")?.classList.remove("hidden");
    } else {
      document.getElementById("off-button")?.setAttribute("class", "hidden");
      document.getElementById("on-button")?.classList.remove("hidden");
    }
  }

  return (
    <div id="recording">
      <div id="on-button" class="">
        <button id="record-on" onClick={buttonClick}>
          Start Recording Data
        </button>
      </div>
      <div id="off-button" class="hidden">
        <button id="record-off" onClick={buttonClick}>
          Stop Recording Data
        </button>
      </div>
    </div>
  );
}
