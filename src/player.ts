import { SQUARE_SIZE } from "./game";

export type Position = {
  x: number;
  y: number;
};

export type Direction = "up" | "right" | "down" | "left";

export class Player {
  private position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  move(direction: Direction): Position {
    const current = this.position;
    switch (direction) {
      case "down":
        this.position = { x: current.x, y: current.y + SQUARE_SIZE + 20 };
        break;
      case "up":
        this.position = { x: current.x, y: current.y - SQUARE_SIZE - 20 };
        break;
      case "left":
        this.position = { x: current.x - SQUARE_SIZE - 20, y: current.y };
        break;
      case "right":
        this.position = { x: current.x + SQUARE_SIZE + 20, y: current.y };
        break;
      default:
        throw Error("invalid direction");
    }
    return this.position;
  }

  getPosition() {
    return this.position;
  }
}
