import Phaser from "phaser";

export default class Cell extends Phaser.GameObjects.Zone {
  constructor(scene, x, y, key, xindex, yindex, size) {
    super(scene, x, y, key);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.xindex = xindex;
    this.yindex = yindex;
    this.key = "x" + xindex + "y" + yindex;
    this.size = size;
    this.owner = null;
    this.thickness = 2;
    this.color = 0xfafafa;

    this.holdedCards = [];

    this.setRectangleDropZone(this.size, this.size);
    this.graphics = scene.add.graphics();
    this.graphics.lineStyle(this.thickness, this.color);
    this.graphics.strokeRect(this.x, this.y, this.size, this.size);

    this.setInteractive({ dropZone: true });
    this.on("pointerdown", this.onPointerDownHandler, this);
    this.on("pointerup", this.onPointerUpHandler, this);

    this.disableCell();
  }

  resetColor() {
    this.graphics.clear();
    this.graphics.lineStyle(this.thickness, this.color);
    this.graphics.strokeRect(this.x, this.y, this.size, this.size);
  }

  setColor(col) {
    this.graphics.clear();
    this.graphics.lineStyle(this.thickness, col);
    this.graphics.strokeRect(this.x, this.y, this.size, this.size);
  }

  addCard(card) {
    this.holdedCards.push(card);
    this.owner = card.player;
    this.color = card.color;
    this.setColor(this.color);
  }

  disableCell() {
    this.input.enabled = false;
    this.setColor(0x000222);
  }

  enableCell() {
    this.input.enabled = true;
    this.setColor(this.color);
  }

  checkValidDrop(newCard) {
    let valid = true;
    if (this.holdedCards.length > 0) {
      let lastCard = this.holdedCards.slice().pop();
      if (lastCard.value >= newCard.value) {
        console.log("Inferior value !");
        valid = false;
      }
      // if (lastCard.player !== newCard.player) {
      //   console.log("Different player !");
      //   valid = false;
      // }
    }
    return valid;
  }

  onPointerDownHandler() {
    // this.setColor(0xaaaaaa);
    // console.log("Cell no " + this.key);
  }
  onPointerUpHandler() {
    // this.resetColor();
  }

  preload() {}

  create() {}

  update(time, delta) {}
}
