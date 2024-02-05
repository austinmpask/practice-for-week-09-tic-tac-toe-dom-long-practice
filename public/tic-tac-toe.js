const xImg = `<img src="https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg"></img>`;
const oImg = `<img src="https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg"></img>`;
let playerOne = true;
let playing = true;
let played = {};
let winElement;

function enableNewGame() {
  document.getElementById("new-game").disabled = false;
  document.getElementById("give-up").disabled = true;
}

function saveGame() {
  sessionStorage.setItem("playerOne", JSON.stringify(playerOne));
  sessionStorage.setItem("playing", JSON.stringify(playing));
  sessionStorage.setItem("played", JSON.stringify(played));
}

function checkWinner() {
  const board = Object.values(played);
  if (board[4] !== null) {
    //check diagonals
    if (board[0] === board[4] && board[4] === board[8]) {
      return board[4];
    }
    if (board[2] === board[4] && board[4] === board[6]) {
      return board[4];
    }
  }
  //check horizontals
  for (let i = 0; i <= 6; i += 3) {
    const value = board[i];
    if (board[i] !== null) {
      if (board[i + 1] === value && board[i + 2] === value) {
        return value;
      }
    }
  }
  //check verticals
  for (let i = 0; i < 3; i++) {
    const value = board[i];
    if (board[i] !== null) {
      if (board[i + 3] === value && board[i + 6] === value) {
        return value;
      }
    }
  }

  if (!board.some((index) => index === null)) {
    return 2;
  }

  return null;
}

function initBoard(refresh) {
  let freshLoad = true;
  if (sessionStorage.getItem("playerOne") && refresh) {
    console.log("loading save");
    freshLoad = false;
    playerOne = JSON.parse(sessionStorage.getItem("playerOne"));
    playing = JSON.parse(sessionStorage.getItem("playing"));
    played = JSON.parse(sessionStorage.getItem("played"));
  }

  const idPart = "square-";
  const gameBoard = document.getElementById("game-board");
  console.log(playing);

  if (playing) {
    document.getElementById("new-game").disabled = true;
    document.getElementById("give-up").disabled = false;
  } else {
    const winMemo = document.createElement("span");
    winMemo.innerHTML = JSON.parse(sessionStorage.getItem("winElement"));
    winMemo.id = "win";
    document.getElementById("title").insertAdjacentElement("afterend", winMemo);

    document.getElementById("new-game").disabled = false;
    document.getElementById("give-up").disabled = true;
  }

  for (let i = 0; i < 9; i++) {
    const square = document.createElement("div");
    const id = idPart + i.toString();

    square.classList.add("square");
    square.id = id;
    if (freshLoad) {
      played[id] = null;
    } else {
      const values = Object.values(played);
      switch (values[i]) {
        case 1:
          square.innerHTML = xImg;
          break;
        case 0:
          square.innerHTML = oImg;
          break;
      }
    }
    gameBoard.appendChild(square);
  }
}

function addListeners() {
  document.querySelectorAll("div.square").forEach((square) => {
    square.addEventListener("click", () => {
      const id = square.id;
      if (played[id] === null && playing) {
        switch (playerOne) {
          case true:
            square.innerHTML = xImg;
            playerOne = false;
            played[id] = 1;
            break;
          case false:
            square.innerHTML = oImg;
            playerOne = true;
            played[id] = 0;
            break;
        }
        const winner = checkWinner();

        if (winner !== null) {
          processWinner(winner);
        }
        saveGame();
      }
    });
  });
}

function processWinner(winner) {
  playing = false;
  saveGame();
  enableNewGame();
  let text = "Winner: ";
  switch (winner) {
    case 0:
      text += "O";
      break;
    case 1:
      text += "X";
      break;
    case 2:
      text += "None";
      break;
  }
  const winMemo = document.createElement("span");
  winMemo.innerHTML = text;
  winMemo.id = "win";
  document.getElementById("title").insertAdjacentElement("afterend", winMemo);

  sessionStorage.setItem("winElement", JSON.stringify(text));
}

document.addEventListener("DOMContentLoaded", () => {
  initBoard(true);
  addListeners();

  document.getElementById("new-game").addEventListener("click", () => {
    if (!playing) {
      sessionStorage.clear();
      document.getElementById("win").remove();
      document.querySelectorAll("div.square").forEach((square) => {
        square.remove();
      });
      playing = true;
      playerOne = true;
      played = {};
      initBoard(false);
      addListeners();
    }
  });

  document.getElementById("give-up").addEventListener("click", () => {
    if (playing) {
      playerOne ? processWinner(0) : processWinner(1);
    }
  });
});
