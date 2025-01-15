import { Player, PlayerDirection, Position } from "./player";

export class Rival {
  private position: Position;
  private board: HTMLDivElement;
  private pathIndex: number = 0;
  private moveInterval: number | undefined;
  private winnerPath: PlayerDirection[];

  constructor(
    initialPosition: Position,
    board: HTMLDivElement,
    winnerPath: PlayerDirection[]
  ) {
    this.position = initialPosition;
    this.board = board;
    this.winnerPath = winnerPath;
    this.draw(initialPosition);
  }

  draw(position: Position, options?: { clear?: boolean }): void {
    const { x, y } = position;
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

  private move(direction: PlayerDirection) {
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

    this.draw(this.position, { clear: true });
    this.draw(newPos);
    this.position = newPos;
  }

  getPosition(): Position {
    return this.position;
  }

  isCollidingWith(player: Player): boolean {
    const playerPos = player.getPosition();
    return this.position.x === playerPos.x && this.position.y === playerPos.y;
  }
}
