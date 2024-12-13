import { Direction, Player, winnerPath } from "./player";

export type Square = {
  x: number;
  y: number;
  walls: Direction[];
};

const movementMap = {
  left: (row: number, col: number) => [row, col - 1],
  right: (row: number, col: number) => [row, col + 1],
  top: (row: number, col: number) => [row - 1, col],
  bottom: (row: number, col: number) => [row + 1, col],
} as const;
const oppositeMap = {
  left: "right",
  right: "left",
  top: "bottom",
  bottom: "top",
} as const;

export const SQUARE_SIZE = 30;

const root = document.documentElement;

type GameConfig = {
  rotationSpeed?: number; // in miliseconds
  enemySpeed?: number; // in miliseconds
};

class Game {
  // [updated]: Changed player initialization to be just null as we'll create it in constructor
  private player: Player;
  private maze: Square[][];
  // private enemy: {
  //   position: Position;
  //   path: Position[];
  // };
  // private target: Position;
  private isRunning = false;
  private isOver = false;
  private intervalId: number | undefined;

  constructor(board: HTMLDivElement, config: GameConfig) {
    this.maze = []; // generateMaze
    // [updated]: Initialize player here with a starting position
    this.player = new Player({ x: 0, y: 0 }, board);
  }

  getPlayer() {
    return this.player;
  }

  update() {
    // Update game state here
    // 1. Update enemy position based on path
    // 2. Check win/lose conditions
  }

  draw(board: HTMLDivElement) {
    // Draw maze (i dont think redrawing the maze everytime is ok)
    this.drawMaze(board);
  }

  private drawMaze(board: HTMLDivElement) {
    let rows = board.querySelectorAll('[class^="row-"]');
    let cells = Array.from(rows).map((row) =>
      row.querySelectorAll('[class^="cell-"]')
    );

    let [row, col] = [0, 0];

    for (let i = 0; i < winnerPath.length - 1; i++) {
      const step = winnerPath[i];
      const currentCell = cells[row][col] as HTMLDivElement;
      currentCell.style[`border-${step}` as any] = "none";
      [row, col] = movementMap[step](row, col);
      const nextCell = cells[row][col] as HTMLDivElement;
      nextCell.style[`border-${oppositeMap[step]}` as any] = "none";
    }
    const lastStep = winnerPath[winnerPath.length - 1];
    const currentCell = cells[row][col] as HTMLDivElement;
    currentCell.style[`border-${oppositeMap[lastStep]}` as any] = "none";
  }

  start(board: HTMLDivElement) {
    this.isRunning = true;
    document.querySelector(".status")!.textContent = "Playing ▶️";
    this.intervalId = setInterval(
      () => setupRotation(board),
      2500 + Math.random() * 2500
    );
  }

  stop() {
    this.isRunning = false;
    document.querySelector(".status")!.textContent = "Paused ⏸️";
    clearInterval(this.intervalId);
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
  // Only run if game is active/unfinished
  // !game.isRunning || game.isFinished
  if (!game.isGameRunning()) return;

  // Update game state
  game.update();

  // Draw new frame
  game.draw(board);

  // Schedule next frame
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
