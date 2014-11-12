goog.provide('game.Main');

goog.require('game.Entity');



/**
 * The game.
 *
 * @constructor
 */
game.Main = function() {
  /** @type {!game.Entity} */
  this.player = new game.Entity();
  this.init();
  this.render();
};


/**
 * Setup for our app.
 */
game.Main.prototype.init = function() {
  this.player.attach(document.body);
};


/**
 * Main render loop.
 */
game.Main.prototype.render = function() {
  window.requestAnimationFrame(this.render.bind(this));
  // Do all the rendering here
};


// Start
var main = new game.Main();
