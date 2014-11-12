goog.provide('Game');



/**
 * The game.
 *
 * @constructor
 * @export
 */
Game = function() {
  /** @type {!Game.Entity} */
  this.player = new Game.Entity();
  this.init();
  this.render();
};


/**
 * Setup for our app.
 */
Game.prototype.init = function() {
  this.player.attach(document.body);
};


/**
 * Main render loop.
 */
Game.prototype.render = function() {
  window.requestAnimationFrame(this.render.bind(this));
  // Do all the rendering here
};


// Start
var game = new Game();
