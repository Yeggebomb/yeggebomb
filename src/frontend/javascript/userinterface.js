goog.provide('game.UserInterface');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * User Interface singleton class.
 *
 * @constructor
 * @extends {game.core.Entity}
 */
game.UserInterface = function() {
  game.UserInterface.base(this, 'constructor');
  this.el.classList.add(game.UserInterface.CLASS_NAME);

  this.timerDiv = document.createElement('div');
  this.timerDiv.classList.add('timer');
  this.el.appendChild(this.timerDiv);

  game.core.helper.mixin(this);
};
game.core.helper.inherit(game.UserInterface, game.core.Entity);


/**
 * Time in ms to update the display of the counter.
 *
 * @type {number}
 */
game.UserInterface.COUNTDOWN_DELAY = 100;


/**
 * Draw the timer.
 *
 * @param {string} label
 * @param {number} countDownTo The time we are counting down to.
 */
game.UserInterface.prototype.drawCountDown = function(label, countDownTo) {
  var remainder = countDownTo - +new Date();
  if (remainder <= 0) return;
  this.timerDiv.innerText = label + ' ' + (remainder / 1000).toFixed(1);
  setTimeout(this.drawCountDown.bind(this, label, countDownTo),
      game.UserInterface.COUNTDOWN_DELAY);
};


/**
 * @type {String}
 */
game.UserInterface.CLASS_NAME = 'userInterface';
