goog.provide('game.Main');

goog.require('game.Player');
goog.require('game.Point');



/**
 * The game.
 *
 * @constructor
 */
game.Main = function() {
  /** @type {!game.Player} */
  this.player = new game.Player();
  this.init();
  this.render();
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.player.setSize(new game.Size(100, 100));
  this.player.setPosition(new game.Point(100, 100));
  this.player.setBackground('white');
  this.player.attach(document.body);
};


/**
 * Main render loop.
 */
game.Main.prototype.render = function() {
  window.requestAnimationFrame(this.render.bind(this));
};


// Start
var main = new game.Main();
