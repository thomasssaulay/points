import Phaser from "phaser";

export class TextButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text) {
    super(scene, x, y, text);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.text = text;

    this.style = {
      font: "4vw courier",
      color: "#fafafa"
    };
    this.setInteractive({ useHandCursor: true });
  }
}
