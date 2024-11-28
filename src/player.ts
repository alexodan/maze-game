export type Position = {
  x: number;
  y: number;
};

export type Direction = "up" | "right" | "down" | "left";

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
  private ctx!: CanvasRenderingContext2D;

  constructor(initialPosition: Position, ctx: CanvasRenderingContext2D) {
    this.initialize(initialPosition, ctx);
  }

  private initialize(position: Position, ctx: CanvasRenderingContext2D) {
    this.position = position;
    this.facing = "down";
    this.isMoving = false;
    this.frameIndex = 0;
    this.ctx = ctx;
    this.spriteSheet = new Image();
    this.spriteSheet.src = `/Player_Actions_Anim.png`;
    this.spriteSheet.onload = () => this.draw(this.ctx);

    // Size of each frame
    this.spriteSize = 48;
    this.spritePositions = {
      down: { row: 9, frames: 6 },
      up: { row: 10, frames: 6 },
      left: { row: 11, frames: 6 },
      right: { row: 6, frames: 6 },
    };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const position = this.spritePositions[this.facing];
    const sourceX = this.frameIndex * this.spriteSize;
    const sourceY = position.row * this.spriteSize;

    ctx.drawImage(
      this.spriteSheet,
      sourceX,
      sourceY,
      this.spriteSize,
      this.spriteSize,
      this.position.x,
      this.position.y,
      this.spriteSize,
      this.spriteSize
    );
  }

  move(direction: Direction): Position {
    this.facing = direction;
    const moveAmount = 50;
    const current = this.position;
    for (let i = 10; i <= moveAmount; i += 10) {
      switch (direction) {
        case "down":
          this.position = { x: current.x, y: current.y + i };
          break;
        case "up":
          this.position = { x: current.x, y: current.y - i };
          break;
        case "left":
          this.position = { x: current.x - i, y: current.y };
          break;
        case "right":
          this.position = { x: current.x + i, y: current.y };
          break;
        default:
          throw Error("invalid direction");
      }
    }
    return this.position;
  }

  getPosition(): Position {
    return this.position;
  }
}
