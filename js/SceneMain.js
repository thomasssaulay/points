import Phaser from "phaser";

import Cell from "./Cell";
import Deck from "./Deck";

const colors = ["#fe6666", "#6678fe", "#fdfe67", "#6cff66"];
const playersNames = ["red", "blue", "yellow", "green"];

export default class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }

  init(gameConfig) {
    this.numOfPlayers = gameConfig.nPlayers;
    this.numAlignedToWin = gameConfig.cellsToWin;
    this.decks = [];
    this.cells = [];
    this.gridSize = 6;
    this.turn = 0;
  }

  preload() {
    for (let i = 1; i <= 9; i++) {
      this.load.image("c" + i, "./assets/sprites/c" + i + ".svg");
    }
    this.load.image("back", "./assets/sprites/back.svg");
    this.load.image("front", "./assets/sprites/front.svg");
  }

  create() {
    const { width, height } = this.sys.game.config;
    this.width = width;
    this.height = height;

    this.initHUD();

    this.createGrid(width / 2, height / 2, this.gridSize, this.gridSize, 50);

    let deckCoords = [
      [75, 50],
      [75, height - 50],
      [width - 75, 50],
      [width - 75, height - 50]
    ];
    for (let i = 0; i < this.numOfPlayers; i++) {
      this.createDeck(i, deckCoords[i][0], deckCoords[i][1], 18);
    }

    // First player is allowed to play
    this.decks[this.turn].input.enabled = true;

    this.input.on("dragenter", this.onDragEnter, this);
    this.input.on("dragleave", this.onDragLeave, this);
    this.input.on("drop", this.onDrop, this);
    this.input.on("dragend", this.onDragEnd, this);
  }

  initHUD() {
    this.textColorOfPlayer = this.add
      .text(75, this.height / 2 - 20, playersNames[this.turn], {
        font: "24px courier",
        color: colors[this.turn]
      })
      .setOrigin(0.5, 0.5);
    this.textPlayersTurn = this.add
      .text(75, this.height / 2 + 10, "player's\nturn", {
        font: "18px courier",
        color: "white"
      })
      .setOrigin(0.5, 0.5);
  }

  createGrid(x, y, nRows, nCols, size) {
    let gap = 5;
    let xOffset = (nCols * (size + gap)) / 2 - 4; // ????
    let yOffset = (nRows * (size + gap)) / 2 - 4;
    let centerRows = Math.trunc(nRows / 2);
    let centerCols = Math.trunc(nCols / 2);
    for (let i = 0; i < nRows; i++) {
      this.cells[i] = [];
      for (let j = 0; j < nCols; j++) {
        this.cells[i][j] = new Cell(
          this,
          x + i * (size + gap) - xOffset,
          y + j * (size + gap) - yOffset,
          null,
          i,
          j,
          size
        );
        if (
          (i === centerRows && j === centerCols) ||
          (i === centerRows - 1 && j === centerCols) ||
          (i === centerRows && j === centerCols - 1) ||
          (i === centerRows - 1 && j === centerCols - 1)
        ) {
          this.cells[i][j].enableCell();
        }
      }
    }
  }

  createDeck(player, x, y, numOfCards = 18) {
    this.decks[player] = new Deck(
      this,
      x,
      y,
      "d" + player,
      null,
      numOfCards,
      player
    );
  }

  validDrop(card, cell) {
    cell.addCard(card);
    card.moveCard(cell.x + cell.size / 2, cell.y + cell.size / 2);
    card.input.enabled = false;
    this.decks[card.player].disableInput();
    if (this.checkForVictory(card, cell) === false) {
      // NORMAL TURN
      this.enableNeighboorCells(cell);
      this.nextTurn();
      this.decks[this.turn].enableInput();
    } else {
      // VICTORY
      this.textPlayersTurn.setColor(colors[this.turn]);
      this.textPlayersTurn.text = "won the\nround !";
    }
  }

  enableNeighboorCells(cell) {
    let neighboors = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [1, -1]
    ];

    neighboors.forEach(el => {
      if (
        cell.xindex + el[0] >= 0 &&
        cell.xindex + el[0] < this.gridSize &&
        cell.yindex + el[1] >= 0 &&
        cell.yindex + el[1] < this.gridSize
      ) {
        this.cells[cell.xindex + el[0]][cell.yindex + el[1]].enableCell();
      }
    });
  }

  checkForVictory(card, cell) {
    let numAlignedToWin = this.numAlignedToWin;
    let winCond = false;
    let directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    directions.forEach(el => {
      let numAligned = this.countOwnedCells(el, cell, card, numAlignedToWin);
      if (numAligned === numAlignedToWin - 1) {
        winCond = true;
      }
    });
    return winCond;
  }

  countOwnedCells(direction, cell, card, cellsToCheck) {
    let numAligned = 0;
    for (let i = 1; i <= cellsToCheck; i++) {
      if (
        cell.xindex + direction[0] * i >= 0 &&
        cell.xindex + direction[0] * i < this.gridSize &&
        cell.yindex + direction[1] * i >= 0 &&
        cell.yindex + direction[1] * i < this.gridSize &&
        this.cells[cell.xindex + direction[0] * i][
          cell.yindex + direction[1] * i
        ].owner === card.player
      ) {
        numAligned++;
      }
    }
    for (let i = -1; i >= -cellsToCheck; i--) {
      if (
        cell.xindex + direction[0] * i >= 0 &&
        cell.xindex + direction[0] * i < this.gridSize &&
        cell.yindex + direction[1] * i >= 0 &&
        cell.yindex + direction[1] * i < this.gridSize &&
        this.cells[cell.xindex + direction[0] * i][
          cell.yindex + direction[1] * i
        ].owner === card.player
      ) {
        numAligned++;
      }
    }
    return numAligned;
  }

  nextTurn() {
    if (this.turn < this.numOfPlayers - 1) this.turn++;
    else this.turn = 0;
    this.updateText();
  }
  onDragEnter(pointer, card, cell) {
    cell.setColor(card.color);
  }
  onDragLeave(pointer, card, cell) {
    cell.resetColor();
  }
  onDrop(pointer, card, cell) {
    if (cell.checkValidDrop(card)) {
      card.dropped = true;
      this.validDrop(card, cell);
    } else {
      card.moveCard(card.input.dragStartX, card.input.dragStartY);
      card.input.enabled = true;
    }

    card.resetColor();
    cell.resetColor();
  }
  onDragEnd(pointer, card, cell) {
    if (!card.dropped) {
      card.moveCard(card.input.dragStartX, card.input.dragStartY);
    }
  }

  updateText() {
    this.textColorOfPlayer.text = playersNames[this.turn];
    this.textColorOfPlayer.setColor(colors[this.turn]);
  }

  update(time, delta) {}
}
