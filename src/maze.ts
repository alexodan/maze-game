type Cell = {
  row: number;
  col: number;
  // Using a Set to track which neighbors this cell is connected to
  connections: Set<string>;
  visited: boolean;
};

type Direction = {
  row: number;
  col: number;
  name: string;
};

// IA generated lol
export class MazeGenerator {
  private maze: Cell[][];
  private width: number;
  private height: number;
  private directions: Direction[] = [
    { row: -1, col: 0, name: "north" },
    { row: 1, col: 0, name: "south" },
    { row: 0, col: -1, name: "west" },
    { row: 0, col: 1, name: "east" },
  ];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maze = this.initializeMaze();
  }

  private initializeMaze(): Cell[][] {
    const maze: Cell[][] = [];
    for (let row = 0; row < this.height; row++) {
      maze[row] = [];
      for (let col = 0; col < this.width; col++) {
        maze[row][col] = {
          row,
          col,
          connections: new Set<string>(),
          visited: false,
        };
      }
    }
    return maze;
  }

  private isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  private getRandomNeighbor(cell: Cell): Cell | null {
    const validNeighbors: Cell[] = [];

    for (const dir of this.directions) {
      const newRow = cell.row + dir.row;
      const newCol = cell.col + dir.col;

      if (this.isValidCell(newRow, newCol)) {
        validNeighbors.push(this.maze[newRow][newCol]);
      }
    }

    if (validNeighbors.length === 0) return null;
    return validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
  }

  private connectCells(current: Cell, next: Cell) {
    const rowDiff = next.row - current.row;
    const colDiff = next.col - current.col;

    let currentToNext: string;
    let nextToCurrent: string;

    if (rowDiff === -1) {
      currentToNext = "north";
      nextToCurrent = "south";
    } else if (rowDiff === 1) {
      currentToNext = "south";
      nextToCurrent = "north";
    } else if (colDiff === -1) {
      currentToNext = "west";
      nextToCurrent = "east";
    } else {
      currentToNext = "east";
      nextToCurrent = "west";
    }

    current.connections.add(currentToNext);
    next.connections.add(nextToCurrent);
  }

  generate(): Cell[][] {
    let unvisitedCount = this.width * this.height;
    let current = this.maze[0][0];
    current.visited = true;
    unvisitedCount--;

    while (unvisitedCount > 0) {
      const next = this.getRandomNeighbor(current);
      if (!next) continue;

      if (!next.visited) {
        this.connectCells(current, next);
        next.visited = true;
        unvisitedCount--;
      }
      current = next;
    }

    return this.maze;
  }
}
