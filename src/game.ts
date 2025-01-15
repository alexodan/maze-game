import { MazeGenerator } from "./maze";
import { PlayerDirection, Player, Position } from "./player";
import { Rival } from "./rival";

export type Square = {
  x: number;
  y: number;
  walls: PlayerDirection[];
};

export const SQUARE_SIZE = 30;
export const borderColor = "#00b18a";

const root = document.documentElement;

type GameConfig = {
  rotationSpeed?: number; // in miliseconds
  enemySpeed?: number; // in miliseconds
};

class Game {
  private player: Player;
  private rival: Rival;

  private maze: MazeGenerator;
  private target: Position;
  private isRunning = false;
  private intervalId: number | undefined;
  public isOver = false;

  constructor(board: HTMLDivElement, config: GameConfig) {
    this.maze = new MazeGenerator(7, 7);
    this.maze.generate();

    const start = { x: 0, y: 0 };
    const { goalPosition, path } = this.maze.findGoalAndPath(start);

    this.player = new Player(start, board, this.maze);
    this.target = goalPosition;

    const { x, y } = this.target;
    const row = board.querySelector(`[class="row-${y + 1}"]`)!;
    const cell = row.querySelector(`[class="cell-${x + 1}"]`)!;
    cell.textContent = "⛳";

    this.rival = new Rival(start, board, path);
  }

  getPlayer() {
    return this.player;
  }

  update() {
    const playerPos = this.player.getPosition();
    const rivalPos = this.rival.getPosition();

    // Check win/lose conditions
    if (playerPos.x === this.target.x && playerPos.y === this.target.y) {
      this.isOver = true;
      this.stop();
      setTimeout(() => {
        document.querySelector(".status")!.textContent = "Game over. You win!";
      }, 50);
    } else if (rivalPos.x === this.target.x && rivalPos.y === this.target.y) {
      this.isOver = true;
      this.stop();
      setTimeout(() => {
        document.querySelector(".status")!.textContent = "Game over. You lost!";
      }, 50);
    }
  }

  drawMaze(board: HTMLDivElement) {
    let rows = board.querySelectorAll('[class^="row-"]');
    let cells = Array.from(rows).map((row) =>
      row.querySelectorAll('[class^="cell-"]')
    );
    // New code to draw the Aldous-Broder generated maze
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
        const cell = this.maze.getCell(row, col);
        if (!cell) continue;
        const domCell = cells[row][col] as HTMLDivElement;
        // Reset borders first
        domCell.style.border = `8px solid ${borderColor}`;
        if (cell.connections.has("north")) {
          domCell.style.borderTop = "none";
        }
        if (cell.connections.has("south")) {
          domCell.style.borderBottom = "none";
        }
        if (cell.connections.has("east")) {
          domCell.style.borderRight = "none";
        }
        if (cell.connections.has("west")) {
          domCell.style.borderLeft = "none";
        }
      }
    }
  }

  start(board: HTMLDivElement) {
    this.isRunning = true;
    document.querySelector(".status")!.textContent = "Playing ▶️";
    this.intervalId = setInterval(
      () => setupRotation(board),
      1000 + Math.random() * 1000
    );
    this.rival.startMoving(800);
  }

  stop() {
    this.isRunning = false;
    document.querySelector(".status")!.textContent = "Paused ⏸️";
    clearInterval(this.intervalId);
    this.rival.stopMoving();
  }

  isGameRunning() {
    return this.isRunning && !this.isOver;
  }
}

export function initGame(board: HTMLDivElement): void {
  board.tabIndex = 1;
  board.focus();

  const game = new Game(board, {});

  setupControls(game, board);

  game.start(board);
  gameLoop(game, board);
}

function gameLoop(game: Game, board: HTMLDivElement) {
  if (!game.isGameRunning()) return;

  game.update();
  game.drawMaze(board);
  requestAnimationFrame(() => gameLoop(game, board));
}

function setupControls(game: Game, board: HTMLDivElement) {
  board.addEventListener("keydown", (e) => {
    const mapKeyToDirection = {
      ArrowDown: "down",
      ArrowUp: "up",
      ArrowLeft: "left",
      ArrowRight: "right",
    } as const;

    const key = e.key as keyof typeof mapKeyToDirection;
    const isMovement = Boolean(mapKeyToDirection[key]);

    if (isMovement && game.isGameRunning()) {
      const player = game.getPlayer();
      player?.move(mapKeyToDirection[key]);
    } else if (e.key === "Escape") {
      if (game.isGameRunning()) {
        game.stop();
      } else {
        game.start(board);
        gameLoop(game, board);
      }
    }
  });

  board.addEventListener("blur", () => {
    if (game.isGameRunning()) {
      game.stop();
    }
  });

  board.addEventListener("focus", () => {
    if (!game.isGameRunning() && !game.isOver) {
      game.start(board);
      gameLoop(game, board);
    }
  });
}

function setupRotation(board: HTMLDivElement) {
  const direction = Math.random() > 0.5 ? "left" : "right";
  const currentRotation = root.style.getPropertyValue("--rotation");
  if (!currentRotation) {
    board.classList.add("rotate");
  }
  const deg = currentRotation ? parseInt(currentRotation) : 0;
  if (direction === "left") {
    root.style.setProperty("--rotation", `${deg - 90}deg`);
  } else {
    root.style.setProperty("--rotation", `${deg + 90}deg`);
  }
}
