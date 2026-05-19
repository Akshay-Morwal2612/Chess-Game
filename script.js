import { playSound } from "./sounds.js";
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.0.0/+esm";

const game = new Chess();

const board = document.getElementById("board");
const message = document.getElementById("message");
const win = document.getElementById("winner");

const pieces = {
  wp: "♙",
  wr: "♖",
  wn: "♘",
  wb: "♗",
  wq: "♕",
  wk: "♔",

  bp: "♟",
  br: "♜",
  bn: "♞",
  bb: "♝",
  bq: "♛",
  bk: "♚"
};

let selectedSquare = null;

/* ---------------- MESSAGE ---------------- */
function showMessage(text) {
  message.textContent = text;
  message.style.opacity = "1";

  setTimeout(() => {
    message.style.opacity = "0";
  }, 1500);
}

/* ---------------- FIND KING ---------------- */
function getKingPosition(color) {
  const boardState = game.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = boardState[row][col];

      if (piece && piece.type === "k" && piece.color === color) {
        return String.fromCharCode(97 + col) + (8 - row);
      }
    }
  }
  return null;
}

/* ---------------- BOARD ---------------- */
function createBoard() {
  board.innerHTML = "";

  const currentBoard = game.board();

  const inCheck = game.isCheck();
  const kingPos = inCheck ? getKingPosition(game.turn()) : null;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      // Colors
      if ((row + col) % 2 === 0) {
        square.classList.add("white");
      } else {
        square.classList.add("black");
      }

      const currentPosition =
        String.fromCharCode(97 + col) + (8 - row);

      square.dataset.position = currentPosition;

      /* ---------------- SELECTED ---------------- */
      if (selectedSquare === currentPosition) {
        square.classList.add("selected");
      }

      /* ---------------- CHECK HIGHLIGHT ---------------- */
      if (inCheck && currentPosition === kingPos) {
        square.classList.add("check");
      }

      /* ---------------- PIECES ---------------- */
      const piece = currentBoard[row][col];

      if (piece) {
        const pieceCode = piece.color + piece.type;
        square.textContent = pieces[pieceCode];
      }

      /* ---------------- CLICK ---------------- */
      square.addEventListener("click", () => {
        if (game.isGameOver()) {
          if (game.isCheckmate()) {
            const winner =
              game.turn() === "w" ? "Black" : "White";

            win.innerText = `🏆 Checkmate! ${winner} wins!`;
          } else if (game.isDraw()) {
            win.innerText = "🤝 Draw!";
          } else {
            win.innerText = "Game Over!";
          }
          return;
        }

        const clickedPiece = game.get(currentPosition);

        /* FIRST CLICK */
        if (selectedSquare === null) {
          if (clickedPiece && clickedPiece.color === game.turn()) {
            selectedSquare = currentPosition;
            createBoard();
          }
          return;
        }

        /* SAME SQUARE */
        if (selectedSquare === currentPosition) {
          selectedSquare = null;
          createBoard();
          return;
        }

        /* MOVE */
        let move = null;

        try {
          move = game.move({
            from: selectedSquare,
            to: currentPosition,
            promotion: "q"
          });
        } catch (error) {
          showMessage("Invalid Move!");
          selectedSquare = null;
          createBoard();
          return;
        }

        if (move) {
          if (game.isCheckmate()) {
            playSound("checkmate");
          } else if (game.isCheck()) {
            playSound("check");
          } else if (move.captured) {
            playSound("capture");
          } else {
            playSound("move");
          }

          selectedSquare = null;
          createBoard();

          /* CHECKMATE */
          if (game.isCheckmate()) {
            const winner =
              move.color === "w" ? "White" : "Black";

            win.innerText = `🏆 Checkmate! ${winner} wins!`;
          }

          /* CHECK */
          else if (game.isCheck()) {
            showMessage("Check!");
          }

          /* DRAW */
          else if (game.isDraw()) {
            win.innerText = "🤝 Draw!";
          }
        }
      });

      board.appendChild(square);
    }
  }
}

createBoard();