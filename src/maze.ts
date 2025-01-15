import { PlayerDirection, Position } from "./player";

type Cell = {
  row: number;
  col: number;
  // Using a Set to track which neighbors this cell is connected to
  connections: Set<string>;
  visited: boolean;
};

type MazeDirection = {
  row: number;
  col: number;
  name: string;
};

// IA generated lol
export class MazeGenerator {
  private maze: Cell[][];
  public width: number;
  public height: number;
  private directions: MazeDirection[] = [
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

  getCell(row: number, col: number): Cell | null {
    if (!this.isValidCell(row, col)) return null;
    return this.maze[row][col];
  }

  findPath(start: Position, end: Position): PlayerDirection[] {
    const queue: { pos: Position; path: PlayerDirection[] }[] = [
      { pos: start, path: [] },
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;
      const posKey = `${pos.y},${pos.x}`;

      if (pos.x === end.x && pos.y === end.y) {
        return path;
      }

      if (visited.has(posKey)) continue;
      visited.add(posKey);

      const currentCell = this.getCell(pos.y, pos.x);
      if (!currentCell) continue;

      // Check all possible directions
      if (
        currentCell.connections.has("north") &&
        !visited.has(`${pos.y - 1},${pos.x}`)
      ) {
        queue.push({
          pos: { x: pos.x, y: pos.y - 1 },
          path: [...path, "up"],
        });
      }
      if (
        currentCell.connections.has("south") &&
        !visited.has(`${pos.y + 1},${pos.x}`)
      ) {
        queue.push({
          pos: { x: pos.x, y: pos.y + 1 },
          path: [...path, "down"],
        });
      }
      if (
        currentCell.connections.has("east") &&
        !visited.has(`${pos.y},${pos.x + 1}`)
      ) {
        queue.push({
          pos: { x: pos.x + 1, y: pos.y },
          path: [...path, "right"],
        });
      }
      if (
        currentCell.connections.has("west") &&
        !visited.has(`${pos.y},${pos.x - 1}`)
      ) {
        queue.push({
          pos: { x: pos.x - 1, y: pos.y },
          path: [...path, "left"],
        });
      }
    }

    return []; // No path found
  }

  // Find the cell that's furthest from the start
  findFurthestCell(start: Position): { position: Position; distance: number } {
    const distances = new Map<string, number>();
    const queue: { pos: Position; distance: number }[] = [
      { pos: start, distance: 0 },
    ];
    let furthestCell = { position: start, distance: 0 };

    while (queue.length > 0) {
      const { pos, distance } = queue.shift()!;
      const posKey = `${pos.y},${pos.x}`;

      if (distances.has(posKey)) continue;
      distances.set(posKey, distance);

      // Update furthest cell if this one is further
      if (distance > furthestCell.distance) {
        furthestCell = { position: pos, distance };
      }

      const currentCell = this.getCell(pos.y, pos.x);
      if (!currentCell) continue;

      // Check all connected neighbors
      if (currentCell.connections.has("north")) {
        queue.push({
          pos: { x: pos.x, y: pos.y - 1 },
          distance: distance + 1,
        });
      }
      if (currentCell.connections.has("south")) {
        queue.push({
          pos: { x: pos.x, y: pos.y + 1 },
          distance: distance + 1,
        });
      }
      if (currentCell.connections.has("east")) {
        queue.push({
          pos: { x: pos.x + 1, y: pos.y },
          distance: distance + 1,
        });
      }
      if (currentCell.connections.has("west")) {
        queue.push({
          pos: { x: pos.x - 1, y: pos.y },
          distance: distance + 1,
        });
      }
    }

    return furthestCell;
  }

  // Method to find a good goal position and its path
  findGoalAndPath(start: Position): {
    goalPosition: Position;
    path: PlayerDirection[];
    difficulty: number;
  } {
    // Find the furthest cell from start
    const furthestCell = this.findFurthestCell(start);

    // Get the path to this cell
    const path = this.findPath(start, furthestCell.position);

    return {
      goalPosition: furthestCell.position,
      path,
      difficulty: furthestCell.distance,
    };
  }
}
