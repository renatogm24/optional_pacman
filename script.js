let mazeGrid = document.querySelector(".mazeGrid");

let current;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.stack = [];
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    current = this.grid[0][0];
  }

  draw2() {
    current.visited = true;

    do {
      let next = current.checkNeighbours();
      if (next) {
        next.visited = true;
        this.stack.push(current);
        current.removeWalls(current, next);
        current = next;
      } else {
        let cell = this.stack.pop();
        current = cell;
      }
    } while (this.stack.length > 0);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show2();
      }
    }
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

    let top = row != 0 ? grid[row - 1][col] : undefined;
    let right = col != grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row != grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col != 0 ? grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  removeWalls(cell1, cell2) {
    let x = cell1.colNum - cell2.colNum;
    if (x == 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x == -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }

    let y = cell1.rowNum - cell2.rowNum;
    if (y == 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y == -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  show2() {
    const newCell = document.createElement("div");
    newCell.classList.add("cell");
    if (this.walls.topWall) newCell.style.borderTop = "2px solid blue";
    if (this.walls.rightWall) newCell.style.borderRight = "2px solid blue";
    if (this.walls.bottomWall) newCell.style.borderBottom = "2px solid blue";
    if (this.walls.leftWall) newCell.style.borderLeft = "2px solid blue";
    mazeGrid.append(newCell);
  }
}

function showCurrent() {
  const player = cellsGridArr[currentX][currentY];
  player.classList.add("player");
}

let newMaze = new Maze(500, 10, 10);
newMaze.setup();
mazeGrid.style.gridTemplateColumns = "repeat(10, 1fr)";
mazeGrid.style.gridTemplateRows = "repeat(10, 1fr)";

newMaze.draw2();

var arrRandom = [];
while (arrRandom.length < 10) {
  var r = Math.floor(Math.random() * 81) + 1;
  if (arrRandom.indexOf(r) === -1) arrRandom.push(r);
}

var arrEnemies = [];
while (arrEnemies.length < 4) {
  var r = Math.floor(Math.random() * 81) + 1;
  if (arrEnemies.indexOf(r) === -1 && arrRandom.indexOf(r) === -1) {
    arrEnemies.push(r);
  }
}

const cellsGrid = document.querySelectorAll(".cell");
const cellsGridArr = [];
const enemiesPositionArr = [];
let index = 0;
for (let x = 0; x < 10; x++) {
  const newArr = [];
  for (let y = 0; y < 10; y++) {
    newArr.push(cellsGrid[index]);
    if (arrRandom.indexOf(index) !== -1) {
      cellsGrid[index].classList.add("blue");
    } else if (arrEnemies.indexOf(index) !== -1) {
      cellsGrid[index].classList.add("enemy");
      enemiesPositionArr.push([x, y]);
    }
    index++;
  }
  cellsGridArr.push(newArr);
}

let currentX = 5;
let currentY = 5;
showCurrent();
let points = 0;
let lifes = 3;
const pointDiv = document.querySelector("#points");
const lifesDiv = document.querySelector("#lifes");

function makeEnemyMove() {
  const enemiesArr = document.querySelectorAll(".enemy");
  for (let index = 0; index < enemiesArr.length; index++) {
    const element = enemiesArr[index];
    element.classList.remove("enemy");
    let enemyY = enemiesPositionArr[index][0];
    let enemyX = enemiesPositionArr[index][1];
    let movement = "none";
    let distMax = 1000;
    let newY;
    let newX;

    let dist1 = Math.sqrt(
      Math.pow(currentX - enemyX, 2) + Math.pow(currentY - enemyY + 1, 2)
    ); //UP
    let dist2 = Math.sqrt(
      Math.pow(currentX - enemyX, 2) + Math.pow(currentY - enemyY - 1, 2)
    ); //DOWN
    let dist3 = Math.sqrt(
      Math.pow(currentX - enemyX - 1, 2) + Math.pow(currentY - enemyY, 2)
    ); //RIGHT
    let dist4 = Math.sqrt(
      Math.pow(currentX - enemyX + 1, 2) + Math.pow(currentY - enemyY, 2)
    ); //LEFT

    if (!newMaze.grid[enemyY][enemyX].walls.topWall && dist1 < distMax) {
      movement = "up";
      distMax = dist1;
    }
    if (!newMaze.grid[enemyY][enemyX].walls.bottomWall && dist2 < distMax) {
      movement = "down";
      distMax = dist2;
    }
    if (!newMaze.grid[enemyY][enemyX].walls.rightWall && dist3 < distMax) {
      movement = "right";
      distMax = dist3;
    }
    if (!newMaze.grid[enemyY][enemyX].walls.leftWall && dist4 < distMax) {
      movement = "left";
      distMax = dist4;
    }

    switch (movement) {
      case "up":
        newY = enemiesPositionArr[index][0] - 1;
        newX = enemiesPositionArr[index][1];
        break;
      case "down":
        newY = enemiesPositionArr[index][0] + 1;
        newX = enemiesPositionArr[index][1];
        break;
      case "right":
        newY = enemiesPositionArr[index][0];
        newX = enemiesPositionArr[index][1] + 1;
        break;
      case "left":
        newY = enemiesPositionArr[index][0];
        newX = enemiesPositionArr[index][1] - 1;
        break;
      default:
        break;
    }

    if (newY === currentX && newX === currentY) {
      lifes--;
      lifesDiv.innerText = "Lifes: " + lifes;
    }

    enemiesPositionArr[index] = [newY, newX];
    const enemy = cellsGridArr[newY][newX];
    enemy.classList.add("enemy");
  }
}

function checkWinner() {
  if (lifes <= 0) {
    clearInterval(enemyInterval);
    alert("You lose");
    document.onkeydown = function (e) {
      e.preventDefault();
    };
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else if (points === 500) {
    clearInterval(enemyInterval);
    alert("You win");
    document.onkeydown = function (e) {
      e.preventDefault();
    };
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

const enemyInterval = setInterval(() => {
  makeEnemyMove();
  checkWinner();
}, 1000);

document.onkeydown = function (e) {
  if (e.keyCode == 40) {
    let newPos = currentX + 1;
    if (!newMaze.grid[newPos][currentY].walls.topWall) {
      const current = cellsGridArr[currentX][currentY];
      if (cellsGridArr[newPos][currentY].classList.contains("blue")) {
        cellsGridArr[newPos][currentY].classList.remove("blue");
        points += 50;
        pointDiv.innerText = "Points: " + points;
      }
      if (cellsGridArr[newPos][currentY].classList.contains("enemy")) {
        lifes--;
        lifesDiv.innerText = "Lifes: " + lifes;
      }
      current.classList.remove("player");
      currentX++;
      showCurrent();
    }
  }
  if (e.keyCode == 38) {
    let newPos = currentX - 1;
    if (!newMaze.grid[newPos][currentY].walls.bottomWall) {
      const current = cellsGridArr[currentX][currentY];
      if (cellsGridArr[newPos][currentY].classList.contains("blue")) {
        cellsGridArr[newPos][currentY].classList.remove("blue");
        points += 50;
        pointDiv.innerText = "Points: " + points;
      }
      if (cellsGridArr[newPos][currentY].classList.contains("enemy")) {
        lifes--;
        lifesDiv.innerText = "Lifes: " + lifes;
      }
      current.classList.remove("player");
      currentX--;
      showCurrent();
    }
  }
  if (e.keyCode == 37) {
    let newPos = currentY - 1;
    if (!newMaze.grid[currentX][newPos].walls.rightWall) {
      const current = cellsGridArr[currentX][currentY];
      if (cellsGridArr[currentX][newPos].classList.contains("blue")) {
        cellsGridArr[currentX][newPos].classList.remove("blue");
        points += 50;
        pointDiv.innerText = "Points: " + points;
      }
      if (cellsGridArr[currentX][newPos].classList.contains("enemy")) {
        lifes--;
        lifesDiv.innerText = "Lifes: " + lifes;
      }
      current.classList.remove("player");
      currentY--;
      showCurrent();
    }
  }
  if (e.keyCode == 39) {
    let newPos = currentY + 1;
    if (!newMaze.grid[currentX][newPos].walls.leftWall) {
      const current = cellsGridArr[currentX][currentY];
      if (cellsGridArr[currentX][newPos].classList.contains("blue")) {
        cellsGridArr[currentX][newPos].classList.remove("blue");
        points += 50;
        pointDiv.innerText = "Points: " + points;
      }
      current.classList.remove("player");
      if (cellsGridArr[currentX][newPos].classList.contains("enemy")) {
        lifes--;
        lifesDiv.innerText = "Lifes: " + lifes;
      }
      currentY++;
      showCurrent();
    }
  }
};
