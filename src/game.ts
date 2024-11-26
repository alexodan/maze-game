import { Direction, Player, Position } from "./player";

export type Square = {
  x: number;
  y: number;
  walls: Direction[];
};

export const SQUARE_SIZE = 30;

const root = document.documentElement;

type GameConfig = {
  rotationSpeed?: number; // in miliseconds
  enemySpeed?: number; // in miliseconds
};

class Game {
  private maze: Square[][];
  private player: Player;
  private enemy: {
    position: Position;
    path: Position[];
  };
  private target: Position;
  private isRunning: boolean = false;
  private intervalId: number | undefined;

  constructor(config?: GameConfig) {
    this.maze = []; // generateMaze
    this.player = new Player({ x: 0, y: 0 });
    this.enemy = {
      position: { x: 0, y: 0 },
      path: [],
    };
    this.target = { x: 4, y: 3 };
  }

  getPlayer() {
    return this.player;
  }

  update() {
    // Update game state here
    // 1. Update enemy position based on path
    // 2. Check win/lose conditions
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Clear the canvas first
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Draw maze (i dont think redrawing the maze everytime is ok)
    this.drawMaze(ctx);
    // Draw player
    this.drawPlayer(ctx);
    // Draw enemy
    this.drawEnemy(ctx);
    // Draw target
    this.drawTarget(ctx);
  }

  private drawMaze(ctx: CanvasRenderingContext2D) {
    const COLS = 8;
    const OFFSET = 50;
    const SQUARE_SIZE = 40;
    const [startX, startY] = [5, 5];

    ctx.fillStyle = "white";
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < COLS; j++) {
        ctx.fillRect(
          startX + i * OFFSET,
          startY + j * OFFSET,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
      }
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const pos = this.player.getPosition();
    ctx.fillStyle = "red";
    ctx.fillRect(pos.x + 10, pos.y + 10, SQUARE_SIZE, SQUARE_SIZE);
  }

  private drawEnemy(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.enemy.position.x + 10,
      this.enemy.position.y + 10,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
  }

  private drawTarget(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.target.x + 10,
      this.target.y + 10,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
  }

  start(ctx: CanvasRenderingContext2D) {
    this.isRunning = true;
    this.intervalId = setInterval(
      () => setupRotation(ctx),
      2500 + Math.random() * 2500
    );
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  isGameRunning() {
    return this.isRunning;
  }
}

export function initGame(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const game = new Game();

  setupControls(canvas, game, ctx);

  game.start(ctx);
  gameLoop(game, ctx);
}

function gameLoop(game: Game, ctx: CanvasRenderingContext2D) {
  // Only run if game is active/unfinished
  // !game.isRunning || game.isFinished
  if (!game.isGameRunning()) return;

  // Update game state
  game.update();

  // Draw new frame
  game.draw(ctx);

  // Schedule next frame
  requestAnimationFrame(() => gameLoop(game, ctx));
}

function checkCollision() {
  return false;
}

function setupControls(
  canvas: HTMLCanvasElement,
  game: Game,
  ctx: CanvasRenderingContext2D
) {
  canvas.addEventListener("keydown", (e) => {
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
      // if checkCollision ...
      player.move(mapKeyToDirection[key]);
    } else if (e.key === "Escape") {
      // Toggle pause
      if (game.isGameRunning()) {
        game.stop();
      } else {
        game.start(ctx);
        gameLoop(game, ctx);
      }
    }
  });
}

function setupRotation(ctx: CanvasRenderingContext2D) {
  const direction = Math.random() > 0.5 ? "left" : "right";
  const currentRotation = root.style.getPropertyValue("--rotation");
  if (!currentRotation) {
    ctx.canvas.classList.add("rotate");
  }
  const deg = currentRotation ? parseInt(currentRotation) : 0;
  if (direction === "left") {
    root.style.setProperty("--rotation", `${deg - 90}deg`);
  } else {
    root.style.setProperty("--rotation", `${deg + 90}deg`);
  }
}
