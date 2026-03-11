var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = []; // "2-2", "3-4". "2-1"

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
  startGame()
}

function setMines() {
  let minesLeft = minesCount; 
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft -= 1;
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-button").addEventListener("click", setFlag)
  setMines();

  // populate our board
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("click", clickTile)
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }

  console.log(board);
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
  } else {
    flagEnabled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgray";
  }
}


function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  let tile = this;
  if (flagEnabled) {
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    }
    else if (tile.innerText == "🚩") {
      tile.innerText = " ";
    }
    return;
  }

  if (minesLocation.includes(tile.id)) {
    // alert("GAME OVER")
    gameOver = true;
    revealMines();
    return;
  }

  let coords = tile.id.split("-") // "0-0" -> ["0", "0"]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}

function checkMine(row, column) {
  if (row < 0 || row >= rows || column < 0 || column >= columns) {
    return;
  }
  if (board[row][column].classList.contains("tile-clicked")) {
    return;
  }

  board[row][column].classList.add("tile-clicked")
  tilesClicked += 1;

  let minesFound = 0;

  // top 3
  minesFound += checkTile(row-1, column-1);   // top left
  minesFound += checkTile(row-1, column);     // top
  minesFound += checkTile(row-1, column+1);   // top right

  minesFound += checkTile(row, column-1);     // left
  minesFound += checkTile(row, column+1);     // right

  minesFound += checkTile(row+1, column-1);    //bottom left
  minesFound += checkTile(row+1, column);      //bottom
  minesFound += checkTile(row+1, column+1)     //bottom right

  if (minesFound > 0) {
    board[row][column].innerText = minesFound;
    board[row][column].classList.add("x" + minesFound.toString());
  }
  else {
    //top 3
    checkMine(row-1, column-1);  //top left
    checkMine(row-1, column);    // top middle
    checkMine(row-1, column+1);  // top right

    //level
    checkMine(row, column-1);  // left
    checkMine(row, column+1);  // right

    //bottom 3 
    checkMine(row+1, column-1); // bottom left
    checkMine(row+1, column);   // bottom middle
    checkMine(row+1, column+1); // bottom right
  }

  if (tilesClicked == rows * columns - minesCount) {
    document.getElementById("mines-count").innerText = "Cleared"
    gameOver = true;
  }

}

function checkTile(row, column) {
  if (row < 0 || row >= rows || column < 0 || column >= rows) {
    return 0;
  }
  if (minesLocation.includes(row.toString() + "-" + column.toString())) {
    return 1;
  }
  return 0;
}