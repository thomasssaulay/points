/**
 * Author: Thomas SAULAY
 * Game inspired by Punto (Bernhard Weber)
 * RULES OF THE GAME
 * Each player has a shuffled deck of 18 card, each from 1 to 9 points.
 * When his turn, he gets one randomly and place it next to a card already
 * on the table (max 6x6 grid), or cover an inferior value card.
 * First one to align four card of his color wins the round.
 **/

import Phaser from "phaser";

import SceneGameOver from "./js/SceneGameOver";
import SceneMainMenu from "./js/SceneMainMenu";
import SceneMain from "./js/SceneMain";

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  backgroundColor: "#222222",
  parent: "game-container",
  scene: [SceneMainMenu, SceneMain, SceneGameOver]
};

const game = new Phaser.Game(config);
