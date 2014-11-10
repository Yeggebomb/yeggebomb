goog.provide('Game');



/**
 * The game.
 *
 * @constructor
 * @export
 */
Game = function() {
  this.init();
};


/**
 * Kicks off the game
 */
Game.prototype.init = function() {
  alert(this.foo(1));
};

/**
 * Adds
 * @param {number} number
 * @return {string}
 */
Game.prototype.foo = function(number) {
  return 'a ' + number;
};


// Start
var game = new Game();
