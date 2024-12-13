import "./style.css";
import { initGame } from "./game.ts";

initGame(document.querySelector<HTMLDivElement>("#board")!);
