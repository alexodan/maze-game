// generated

interface SpriteConfig {
  spriteWidth: number;
  spriteHeight: number;
  sheetWidth: number;
  sheetHeight: number;
}

interface SpritePosition {
  row: number;
  col: number;
}

export class SpriteSelector {
  private element: HTMLElement;
  private readonly spriteWidth: number;
  private readonly spriteHeight: number;
  private readonly sheetWidth: number;
  private readonly sheetHeight: number;
  private readonly columns: number;
  private readonly rows: number;

  constructor(element: HTMLElement, config: SpriteConfig) {
    this.element = element;
    this.spriteWidth = config.spriteWidth;
    this.spriteHeight = config.spriteHeight;
    this.sheetWidth = config.sheetWidth;
    this.sheetHeight = config.sheetHeight;
    this.columns = Math.floor(this.sheetWidth / this.spriteWidth);
    this.rows = Math.floor(this.sheetHeight / this.spriteHeight);
  }

  private isValidPosition(position: SpritePosition): boolean {
    return (
      position.row >= 0 &&
      position.row < this.rows &&
      position.col >= 0 &&
      position.col < this.columns
    );
  }

  private updateBackgroundPosition(x: number, y: number): void {
    this.element.style.backgroundPosition = `-${x}px -${y}px`;
  }

  public selectSprite(row: number, col: number): HTMLElement {
    const position: SpritePosition = { row, col };

    if (!this.isValidPosition(position)) {
      throw new Error(`Invalid sprite position: row ${row}, col ${col}`);
    }

    const x = col * this.spriteWidth;
    const y = row * this.spriteHeight;

    this.updateBackgroundPosition(x, y);
    return this.element;
  }

  public selectSpriteByIndex(index: number): void {
    if (index < 0 || index >= this.rows * this.columns) {
      throw new Error(`Invalid sprite index: ${index}`);
    }

    const row = Math.floor(index / this.columns);
    const col = index % this.columns;
    this.selectSprite(row, col);
  }

  public getCurrentDimensions(): SpriteConfig {
    return {
      spriteWidth: this.spriteWidth,
      spriteHeight: this.spriteHeight,
      sheetWidth: this.sheetWidth,
      sheetHeight: this.sheetHeight,
    };
  }
}
