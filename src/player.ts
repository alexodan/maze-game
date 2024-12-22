import { SQUARE_SIZE } from "./game";
import { SpriteSelector } from "./sprite";

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
  private faceDirection!: Direction;
  private isMoving!: boolean;
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

    // this.spriteSheet = new Image(400, 400);
    // let sprite = new SpriteSelector(this.spriteSheet, {
    //   spriteWidth: 64,
    //   spriteHeight: 64,
    //   sheetWidth: 256,
    //   sheetHeight: 256,
    // });

    // this.spriteSheet.onload = () => {
    //   // TODO: change this f thing to a Board object instead of selecting these everytime
    //   const row = this.board.querySelector(
    //     `[class="row-${this.position.y + 1}"]`
    //   )!;
    //   const cell = row.querySelector(`[class="cell-${this.position.x + 1}"]`)!;
    //   cell.appendChild(sprite.selectSprite(0, 0));
    // };

    // this.spriteSheet.src = "./Player_Actions_Anim.png";
  }

  draw(options?: { clear?: boolean }): void {
    const { x, y } = this.position;
    const row = this.board.querySelector(`[class="row-${y + 1}"]`)!;
    const cell = row.querySelector(`[class="cell-${x + 1}"]`)!;
    const hasRival = cell.textContent?.includes("👻") || false;
    if (options?.clear) {
      cell.textContent = hasRival ? "👻" : " ";
    } else {
      cell.textContent = hasRival ? "👣👻" : "👣";
    }
  }

  move(direction: Direction) {
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

// For testing purposes
// [row, col]
// [0, 0] => right => [0, 1] => right => [0, 2]
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

// algorithms generate maze
//   graph of nodes
//   graph -> matrix ->
// - winner path
// - randomly put the target

// CSS Transitions
// - board sets css variable (class or dataset) based on movement (left,right,top,bottom)
// - choose sprite based on above

// - moving dom element (image) from one cell to the next cell
// const fromCell = ??, const toCell = ??
// window x, y ? -> new x, y (css translate)
// - happens in an animation interval

// check Navbar

/// -----

// Zod unions
// example hastPet, petName
// two objects, and u use union
