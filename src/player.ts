import { MazeGenerator } from "./maze"; // Add import for MazeGame

export type Position = {
  x: number;
  y: number;
};

export type PlayerDirection = "up" | "right" | "down" | "left";

// Map player directions to maze directions
const directionToMazeDirection = {
  up: "north",
  down: "south",
  left: "west",
  right: "east",
} as const;

export class Player {
  private position!: Position;
  private faceDirection!: PlayerDirection;
  private board!: HTMLDivElement;
  private maze!: MazeGenerator;

  constructor(
    initialPosition: Position,
    board: HTMLDivElement,
    maze: MazeGenerator
  ) {
    this.board = board;
    this.position = initialPosition;
    this.maze = maze;
    this.draw(initialPosition);
  }

  draw(position: Position, options?: { clear?: boolean }): void {
    const { x, y } = position;
    const row = this.board.querySelector(`[class="row-${y + 1}"]`)!;
    const cell = row.querySelector(`[class="cell-${x + 1}"]`)!;
    const hasRival = cell.textContent?.includes("👻") || false;
    if (options?.clear) {
      cell.textContent = hasRival ? "👻" : " ";
    } else {
      cell.textContent = hasRival ? "👣👻" : "👣";
    }
  }

  move(direction: PlayerDirection) {
    this.faceDirection = direction;
    const current = this.position;
    let newPos: Position;

    switch (direction) {
      case "down":
        newPos = { x: current.x, y: current.y + 1 };
        break;
      case "up":
        newPos = { x: current.x, y: current.y - 1 };
        break;
      case "left":
        newPos = { x: current.x - 1, y: current.y };
        break;
      case "right":
        newPos = { x: current.x + 1, y: current.y };
        break;
      default:
        throw Error("invalid direction");
    }

    if (this.isValidPosition(newPos, direction)) {
      this.draw(this.position, { clear: true });
      this.draw(newPos);
      this.position = newPos;
    }
  }

  isValidPosition(newPosition: Position, direction: PlayerDirection): boolean {
    // First check if position is within maze bounds
    if (
      newPosition.x < 0 ||
      newPosition.x >= this.maze.width ||
      newPosition.y < 0 ||
      newPosition.y >= this.maze.height
    ) {
      return false;
    }

    // Get current cell and check if it has a connection in the desired direction
    const currentCell = this.maze.getCell(this.position.y, this.position.x);
    if (!currentCell) return false;

    // Check if there's a valid connection in the movement direction
    const mazeDirection = directionToMazeDirection[direction];
    return currentCell.connections.has(mazeDirection);
  }

  getPosition(): Position {
    return this.position;
  }
}
