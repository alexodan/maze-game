import { SQUARE_SIZE } from "./game";

export type Position = {
  x: number;
  y: number;
};

export type Direction = "up" | "right" | "down" | "left";

const mapDirectionToBorder = {
  up: "Top",
  down: "Bottom",
  left: "Left",
  right: "Right",
} as const;

const oppositeWalls = {
  Top: "Bottom",
  Bottom: "Top",
  Left: "Right",
  Right: "Left",
} as const;

export class Player {
  private position!: Position;
  private facing!: Direction;
  private isMoving!: boolean;
  private frameIndex!: number;
  private animationInterval: number | null = null;
  public spriteSize!: number;
  public spriteSheet!: HTMLImageElement;
  private spritePositions!: Record<
    Direction,
    {
      row: number;
      frames: number;
    }
  >;
  private board!: HTMLDivElement;

  constructor(initialPosition: Position, board: HTMLDivElement) {
    this.board = board;
    this.position = initialPosition;
    this.draw();
  }

  draw(options?: { clear?: boolean }): void {
    const { x, y } = this.position;
    const row = this.board.querySelector(`[class="row-${y + 1}"]`)!;
    const cell = row.querySelector(`[class="cell-${x + 1}"]`)!;
    cell.textContent = options?.clear ? " " : "👣";
  }

  move(direction: Direction) {
    this.facing = direction;
    const moveAmount = 1;
    const current = this.position;
    let newPos: Position;
    switch (direction) {
      case "down":
        newPos = { x: current.x, y: current.y + moveAmount };
        break;
      case "up":
        newPos = { x: current.x, y: current.y - moveAmount };
        break;
      case "left":
        newPos = { x: current.x - moveAmount, y: current.y };
        break;
      case "right":
        newPos = { x: current.x + moveAmount, y: current.y };
        break;
      default:
        throw Error("invalid direction");
    }
    if (this.isValidPosition(newPos, direction)) {
      this.draw({ clear: true });
      this.position = newPos;
      this.draw();
    }
  }

  isValidPosition(newPosition: Position, direction: Direction) {
    const rows = this.board.querySelectorAll('[class^="row-"]');
    const cols = rows[0].querySelectorAll('[class^="cell-"]');

    const isWithinEdges =
      newPosition.x >= 0 &&
      newPosition.x < cols.length &&
      newPosition.y >= 0 &&
      newPosition.y < rows.length;

    if (!isWithinEdges) return false;

    const currentRow = rows[this.position.y];
    const currentCell =
      currentRow.querySelectorAll('[class^="cell-"]')[this.position.x];
    const targetRow = rows[newPosition.y];
    const targetCell =
      targetRow.querySelectorAll('[class^="cell-"]')[newPosition.x];

    const wall = mapDirectionToBorder[direction];
    const currentWall = getComputedStyle(currentCell)[`border${wall}Width`];
    const targetWall =
      getComputedStyle(targetCell)[`border${oppositeWalls[wall]}Width`];

    const isBlockedByWall = currentWall !== "0px" || targetWall !== "0px";

    return !isBlockedByWall;
  }

  getPosition(): Position {
    return this.position;
  }
}

export const winnerPath = [
  "right",
  "right",
  "bottom",
  "bottom",
  "left",
  "bottom",
  "bottom",
  "left",
  "bottom",
  "bottom",
  "right",
  "top",
  "right",
  "right",
  "right",
  "bottom",
  "right",
  "right",
  "top",
  "left",
  "top",
  "top",
  "right",
  "top",
  "left",
  "top",
  "left",
  "left",
] as const;
