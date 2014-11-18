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

  this.inactiveLayer = document.createElement('div');

  this.el.appendChild(this.inactiveLayer);

  this.countDownLabel_ = document.createElement('span');
  this.countDownLabel_.className = 'countDownLabel';
  this.countDownLabel_.innerHTML = 'Play Ends In: ';

  this.countDownNumber_ = document.createElement('span');
  this.countDownNumber_.className = 'countDownNumber';

  this.countDownElement_ = document.createElement('div');
  this.countDownElement_.className = 'countDownElement';

  this.countDownElement_.appendChild(this.countDownLabel_);
  this.countDownElement_.appendChild(this.countDownNumber_);
  this.el.appendChild(this.countDownElement_);

  this.countDownTime = 0;

  game.core.helper.mixin(this);
};
game.core.helper.inherit(game.UserInterface, game.core.Entity);


/**
 * Start the timer.
 *
 * @param {string} countDownLabel
 * @param {number} countDownTime
 */
game.UserInterface.prototype.startCountDown = function(
    countDownLabel, countDownTime) {
  if (countDownTime < 0) return;
  this.countDownLabel_.innerHTML = countDownLabel;
  this.drawCountDown(countDownTime);
};


/**
 * Draw the timer.
 *
 * @param {number} countDownTime
 */
game.UserInterface.prototype.drawCountDown = function(countDownTime) {
  if (countDownTime < 0) return;
  this.countDownNumber_.innerHTML = countDownTime;
  setTimeout(this.drawCountDown.bind(this, countDownTime - 1), 1000);
};


/**
 * Show start screen.
 */
game.UserInterface.prototype.showStartScreen = function() {
  this.inactiveLayer.className = 'startScreen';
};


/**
 * Remove start screen.
 */
game.UserInterface.prototype.removeStartScreen = function() {
  this.inactiveLayer.className = '';
};


/**
 * @type {String}
 */
game.UserInterface.CLASS_NAME = 'userInterface';
