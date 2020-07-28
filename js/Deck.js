import Phaser from "phaser";

import Card from "./Card";

const colors = ["0xfe6666", "0x6678fe", "0xfdfe67", "0x6cff66"];

export default class Deck extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, frame, totalCards, player) {
    super(scene, x, y, key, frame);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = key;
    this.totalCards = totalCards;
    this.player = player;
    this.color = colors[player];

    this.availableCards = [];
    let val = 1;
    for (let i = 0; i < this.totalCards; i++) {
      this.availableCards.push(val);
      if (val === 9) {
        val = 1;
      } else {
        val++;
      }
    }
    Phaser.Utils.Array.Shuffle(this.availableCards);

    this.cards = [];

    this.sprite = scene.add
      .sprite(this.x, this.y, "back", 0)
      .setOrigin(0.5, 0.5)
      .setScale(0.35)
      .setTint(this.color);

    this.displayWidth = this.sprite.displayWidth;
    this.displayHeight = this.sprite.displayHeight;

    this.setInteractive();
    this.input.enabled = false;
    this.on("pointerdown", this.onPointerDownHandler);
    this.on("pointerup", this.onPointerUpHandler);
  }

  drawCard() {
    if (this.availableCards.length > 0) {
      let val = this.availableCards.pop();
      this.cards.push(
        new Card(
          this.scene,
          this.x,
          this.y,
          this.totalCards - this.availableCards.length,
          null,
          val,
          this.player
        )
      );
      this.input.enabled = false;
      // console.log("Player no." + this.player);
      // console.log(this.availableCards);
    } else {
      console.log("NO MORE CARDS");
    }
  }

  enableInput() {
    this.input.enabled = true;
  }
  disableInput() {
    this.input.enabled = false;
  }

  resetColor() {
    this.sprite.setTint(this.color);
  }

  setColor(col) {
    this.sprite.setTint(col);
  }

  onPointerDownHandler() {
    this.setColor(0xfafafa);
  }
  onPointerUpHandler() {
    this.resetColor();
    this.drawCard();
  }
  preload() {}

  create() {}

  update(time, delta) {}
}
