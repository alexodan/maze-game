import { Player, Position } from "./player";

export class Rival {
  private position: Position;
  private board: HTMLDivElement;
  private pathIndex: number = 0;
  private moveInterval: number | undefined;
  private winnerPath: ("right" | "left" | "bottom" | "top")[];

  constructor(
    initialPosition: Position,
    board: HTMLDivElement,
    winnerPath: ("right" | "left" | "bottom" | "top")[]
  ) {
    this.position = initialPosition;
    this.board = board;
    this.winnerPath = winnerPath;
    this.draw();
  }

  draw(options?: { clear?: boolean }): void {
    const { x, y } = this.position;
    const row = this.board.querySelector(`[class="row-${y + 1}"]`)!;
    const cell = row.querySelector(`[class="cell-${x + 1}"]`)!;

    const hasPlayer = cell.textContent?.includes("👣") || false;

    if (options?.clear) {
      cell.textContent = hasPlayer ? "👣" : " ";
    } else {
      cell.textContent = hasPlayer ? "👣👻" : "👻";
    }
  }

  startMoving(moveSpeed: number = 1000) {
    if (this.moveInterval) return;

    this.moveInterval = setInterval(() => {
      if (this.pathIndex >= this.winnerPath.length) {
        this.stopMoving();
        return;
      }

      const direction = this.winnerPath[this.pathIndex];
      this.move(direction);
      this.pathIndex++;
    }, moveSpeed);
  }

  stopMoving() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = undefined;
    }
  }

  private move(direction: string) {
    const moveAmount = 1;
    const current = this.position;
    let newPos: Position;

    switch (direction) {
      case "bottom":
        newPos = { x: current.x, y: current.y + moveAmount };
        break;
      case "top":
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

    this.draw({ clear: true });
    this.position = newPos;
    this.draw();
  }

  getPosition(): Position {
    return this.position;
  }

  isCollidingWith(player: Player): boolean {
    const playerPos = player.getPosition();
    return this.position.x === playerPos.x && this.position.y === playerPos.y;
  }
}
