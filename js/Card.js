import Phaser from "phaser";

const colors = ["0xfe6666", "0x6678fe", "0xfdfe67", "0x6cff66"];

export default class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, frame, value, player) {
    super(scene, x, y, key, frame);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = key;
    this.value = value;
    this.player = player;
    this.dropped = false;
    this.color = colors[player];

    this.spriteBack = scene.add
      .sprite(this.x, this.y, "front", 0)
      .setOrigin(0.5, 0.5)
      .setScale(0.35)
      .setTint(this.color);

    this.spritePoints = scene.add
      .sprite(this.x, this.y, "c" + this.value, 0)
      .setOrigin(0.5, 0.5)
      .setScale(0.3)
      .setTint(this.color);

    this.displayWidth = this.spriteBack.displayWidth;
    this.displayHeight = this.spriteBack.displayHeight;

    this.setInteractive({ draggable: true });
    this.on("pointerdown", this.onPointerDownHandler);
    this.on("pointerup", this.onPointerUpHandler);
    this.on("drag", this.onDrag);
  }

  moveCard(x, y, noAnim = false) {
    this.x = x;
    this.y = y;
    if (noAnim) {
      this.spriteBack.x = x;
      this.spriteBack.y = y;
      this.spritePoints.x = x;
      this.spritePoints.y = y;
    } else {
      this.scene.tweens.add({
        targets: [this.spriteBack, this.spritePoints],
        x: x,
        y: y,
        ease: "Sine.easeIn",
        duration: 500,
        onComplete: function() {}
      });
    }
  }

  resetColor() {
    this.spritePoints.setTint(this.color);
    this.spriteBack.setTint(this.color);
  }

  setColor(col) {
    this.spritePoints.setTint(col);
    this.spriteBack.setTint(col);
  }

  onPointerDownHandler() {
    // this.setColor(0xfafafa);
  }
  onPointerUpHandler() {
    // this.resetColor();
  }
  onDrag(pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
    this.moveCard(this.x, this.y, true);
  }

  preload() {}

  create() {}

  update(time, delta) {}
}
