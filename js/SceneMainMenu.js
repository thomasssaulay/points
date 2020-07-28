import Phaser from "phaser";

import { TextButton } from "./TextButton";

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  preload() {}

  create() {
    const { width, height } = this.sys.game.config;
    // var canvas = this.sys.game.canvas;
    // var fullscreen = this.sys.game.device.fullscreen;
    // canvas[fullscreen.request]();
    this.height = height;
    this.width = width;

    const gameConfigs = [
      {
        name: "TWO PLAYERS",
        nPlayers: 2,
        cellsToWin: 6
      },
      {
        name: "THREE PLAYERS",
        nPlayers: 3,
        cellsToWin: 5
      },
      {
        name: "FOUR PLAYERS",
        nPlayers: 4,
        cellsToWin: 4
      }
    ];

    this.buttons = [];
    for (let i = 0; i < 3; i++) {
      this.buttons.push(
        this.add
          .text(this.width / 2, this.height / 2 + 50 * i, gameConfigs[i].name, {
            font: "3vw arial",
            color: "#fafafa"
          })
          .setInteractive({ useHandCursor: true })
          .setOrigin(0.5, 0.5)
          .on("pointerup", () => {
            this.scene.start("SceneMain", gameConfigs[i]);
          })
      );
    }
    // this.test = this.add
    //   .text(this.width / 2, this.height / 2, "TWO PLAYERS\n", {
    //     font: "4vw courier",
    //     color: "#fafafa"
    //   })
    //   .setOrigin(0.5, 0.5);

    // console.log(this.clickButton);

    // this.clickButton
    //   .on("pointerover", () => this.enterButtonHoverState())
    //   .on("pointerout", () => this.enterButtonRestState())
    //   .on("pointerdown", () => this.enterButtonActiveState())
    //   .on("pointerup", () => {
    //     this.updateClickCountText(++clickCount);
    //     this.enterButtonHoverState();
    //   });
    // this.scene.start("SceneMain", gameConfigs[0]);
  }
}
