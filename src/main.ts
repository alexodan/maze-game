import "./style.css";
import { initGame } from "./game.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas" tabindex="1" width="400" height="400">
  </canvas>
`;

initGame(document.querySelector<HTMLCanvasElement>("#canvas")!);
